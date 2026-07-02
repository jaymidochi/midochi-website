export const metadata = {
  title: 'Privacy | Midochi',
}

export default function PrivacyPage() {
  return (
    <main className="page">
      <section className="section">
        <h2>Privacy</h2>
        <p>
          This site uses PostHog analytics to understand how visitors use our content. We collect
          page views, time spent on content sections, video and slide engagement, approximate
          location (country and city, derived from IP), browser and device type, and referral
          source. We also record anonymized session replays of how pages are used.
        </p>
        <p>
          If you arrive via a personalized link or we know your email address, this activity may be
          associated with you so we can follow up relevantly. We do not sell this data or share it
          with third parties beyond the analytics service itself.
        </p>
        <p>
          You can opt out of all tracking using the banner shown on your first visit. To ask what
          data we hold about you or request deletion, email{' '}
          <a href="mailto:jay@midochi.com">jay@midochi.com</a>.
        </p>
      </section>
    </main>
  )
}
