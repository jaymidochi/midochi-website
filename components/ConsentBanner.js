'use client'

import { useEffect, useState } from 'react'

const KEY = 'midochi_consent' // 'accepted' | 'declined'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const choice = localStorage.getItem(KEY)
    if (!choice) {
      setVisible(true)
    } else if (choice === 'declined') {
      window.posthog?.opt_out_capturing?.()
    }
  }, [])

  const decide = (choice) => {
    localStorage.setItem(KEY, choice)
    setVisible(false)
    if (choice === 'declined') {
      window.posthog?.opt_out_capturing?.()
    }
  }

  if (!visible) return null

  return (
    <div className="consent-banner" role="dialog" aria-label="Privacy notice">
      <p>
        This site uses analytics, including session recording, to understand how our content is
        used. <a href="/privacy">Privacy policy</a>
      </p>
      <div className="consent-actions">
        <button onClick={() => decide('accepted')}>OK</button>
        <button className="consent-decline" onClick={() => decide('declined')}>
          Opt out
        </button>
      </div>
    </div>
  )
}
