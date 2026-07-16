import Link from 'next/link'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'

export const metadata = {
  title: 'Work With Us — Midochi',
  description: 'A limited number of mandates each quarter. Begin with a short intake and a conversation with the principal.',
}

const INTAKE = ['Name', 'Website', 'What you are trying to move', 'Business email', 'Phone number']

export default function Page() {
  return (
    <main className="home inner">
      <SiteNav />

      <section className="inner-hero">
        <span className="eyebrow">Work With Us</span>
        <h1>Work With Us</h1>
        <p className="inner-intro">
          We take on a limited number of mandates each quarter, across AI infrastructure, enterprise
          fintech, and private longevity. Engagements begin with a short intake and a direct
          conversation with the principal.
        </p>
      </section>

      <div className="inner-body">
        <section className="inner-section">
          <p className="bullets-intro">The intake covers:</p>
          <ul className="dash-list">
            {INTAKE.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link className="close-cta wwu-cta" href="/call">Request a conversation</Link>
        </section>
      </div>

      <SiteFooter />
    </main>
  )
}
