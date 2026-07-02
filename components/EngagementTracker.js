'use client'

import { useEffect } from 'react'

const HEARTBEAT_MS = 15000
const MIN_VISIBLE_RATIO = 0.5

function ph() {
  // __loaded distinguishes the real library from the pre-load snippet stub,
  // whose methods throw if called with object arguments before array.js arrives.
  return typeof window !== 'undefined' && window.posthog?.__loaded ? window.posthog : null
}

export default function EngagementTracker() {
  useEffect(() => {
    try {
      return setup()
    } catch (e) {
      // Tracking must never take down the page
      console.error('EngagementTracker failed:', e)
    }
  }, [])

  return null
}

function setup() {
  {
    // --- 1. Prospect tag from personalized outreach links (?p=bitvavo-bob) ---
    // Stored as a property, NOT identify(): identify would block the later
    // Slack thread-reply email merge (PostHog refuses re-identification).
    const params = new URLSearchParams(window.location.search)
    const tag = params.get('p')
    if (tag) {
      const apply = () => {
        const p = ph()
        if (!p) return false
        p.register({ prospect_tag: tag })
        p.setPersonProperties({ prospect_tag: tag })
        p.capture('prospect_link_visit', { prospect_tag: tag })
        return true
      }
      if (!apply()) {
        const t = setInterval(() => apply() && clearInterval(t), 500)
        setTimeout(() => clearInterval(t), 10000)
      }
    }
  }

    // --- 2. Section + slides visibility heartbeats (pause on hidden tab) ---
    const visible = new Map() // element -> {slug, kind, accumulatedMs, lastTick}

    const now = () => performance.now()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target
          if (entry.intersectionRatio >= MIN_VISIBLE_RATIO) {
            if (!visible.has(el)) {
              visible.set(el, {
                slug: el.dataset.section || el.dataset.slug,
                kind: el.dataset.embed === 'slides' ? 'slides' : 'section',
                accumulatedMs: 0,
                lastTick: now(),
              })
            }
          } else if (visible.has(el)) {
            flush(el)
            visible.delete(el)
          }
        }
      },
      { threshold: [MIN_VISIBLE_RATIO] }
    )

    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el))
    document.querySelectorAll('[data-embed="slides"]').forEach((el) => observer.observe(el))

    function accumulate() {
      const t = now()
      for (const state of visible.values()) {
        if (!document.hidden) state.accumulatedMs += t - state.lastTick
        state.lastTick = t
      }
    }

    function flush(el) {
      accumulate()
      const state = visible.get(el)
      if (!state) return
      const seconds = Math.round(state.accumulatedMs / 1000)
      state.accumulatedMs = 0
      if (seconds < 3) return
      const p = ph()
      if (!p) return
      p.capture(state.kind === 'slides' ? 'slides_time' : 'section_viewed', {
        [state.kind === 'slides' ? 'deck_slug' : 'section_slug']: state.slug,
        seconds,
      })
    }

    function flushAll() {
      for (const el of visible.keys()) flush(el)
    }

    const heartbeat = setInterval(flushAll, HEARTBEAT_MS)

    const onVisibility = () => accumulate() // freeze/resume timers at the boundary
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flushAll)

    // --- 3. YouTube watch progress (25/50/75/100 milestones) ---
    const milestones = new Map() // videoId -> Set of fired percents
    let ytPoll = null

    function setupYouTube() {
      const iframes = document.querySelectorAll('[data-embed="youtube"] iframe')
      if (!iframes.length) return
      const tagEl = document.createElement('script')
      tagEl.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tagEl)
      window.onYouTubeIframeAPIReady = () => {
        const players = []
        iframes.forEach((iframe) => {
          const videoId = (iframe.src.match(/embed\/([^?]+)/) || [])[1]
          if (!videoId) return
          players.push(new window.YT.Player(iframe, { videoId }))
          milestones.set(videoId, new Set())
        })
        ytPoll = setInterval(() => {
          for (const player of players) {
            if (typeof player.getCurrentTime !== 'function' || typeof player.getDuration !== 'function') continue
            const duration = player.getDuration()
            if (!duration) continue
            const pct = (player.getCurrentTime() / duration) * 100
            const videoId = player.getVideoData?.()?.video_id
            if (!videoId) continue
            const fired = milestones.get(videoId) || new Set()
            milestones.set(videoId, fired)
            for (const m of [25, 50, 75, 100]) {
              if (pct >= (m === 100 ? 98 : m) && !fired.has(m)) {
                fired.add(m)
                ph()?.capture('video_progress', { video_id: videoId, percent: m })
              }
            }
          }
        }, 2000)
      }
    }
    setupYouTube()

    return () => {
      flushAll()
      clearInterval(heartbeat)
      if (ytPoll) clearInterval(ytPoll)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flushAll)
    }
}
