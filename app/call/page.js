'use client'

import { useEffect } from 'react'

const BOOKING_URL = 'https://calendar.app.google/zvqEDYN1ujQMSAoR9'
const REDIRECT_DELAY_MS = 1200

export default function CallPage() {
  useEffect(() => {
    let redirected = false
    const go = () => {
      if (redirected) return
      redirected = true
      // replace() so /call stays out of history and the back button skips it
      window.location.replace(BOOKING_URL)
    }

    try {
      // Prospect tag from personalized links (?p=bitvavo-bob), same pattern as
      // EngagementTracker: register (not identify) so the Slack thread-reply
      // email merge can still claim this anonymous visitor later.
      const tag = new URLSearchParams(window.location.search).get('p')

      const fire = () => {
        const p = window.posthog?.__loaded ? window.posthog : null
        if (!p) return false
        if (tag) {
          p.register({ prospect_tag: tag })
          p.setPersonProperties({ prospect_tag: tag })
        }
        // $pageview fires automatically on load and drives the Slack alert;
        // this is the extra booking-intent signal for the dashboard.
        p.capture('call_booking_click', tag ? { prospect_tag: tag } : {})
        return true
      }

      if (!fire()) {
        const t = setInterval(() => fire() && clearInterval(t), 300)
        setTimeout(() => clearInterval(t), 3000)
      }
    } catch (e) {
      // Tracking must never block the redirect
      console.error('call page tracking failed:', e)
    }

    // Give PostHog a moment to flush the pageview/event, then send them on
    const timer = setTimeout(go, REDIRECT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="page">
      <section className="section">
        <div className="page-hero">
          <h1>Taking you to my calendar…</h1>
        </div>
        <p>
          If nothing happens,{' '}
          <a href={BOOKING_URL}>click here to book a time</a>.
        </p>
      </section>
    </main>
  )
}
