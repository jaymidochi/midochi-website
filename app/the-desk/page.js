import Link from 'next/link'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'

export const metadata = {
  title: 'The Desk — Midochi',
  description: 'A principal-led origination desk. Senior throughout, no handoffs.',
}

const HOW = [
  { h: 'Selective by design.', body: 'We take on a limited number of mandates so each receives principal attention.' },
  { h: 'Above the funnel.', body: 'We work at the level where counterparties are identified, positioned, and moved.' },
  { h: 'Built to hand over.', body: 'We install the origination system as an asset you own, then step out.' },
  { h: 'Access on call.', body: 'Where a mandate requires it, a private network of institutional investors and family offices is available.' },
]

export default function Page() {
  return (
    <main className="home inner">
      <SiteNav />

      <section className="inner-hero">
        <span className="eyebrow">The Desk</span>
        <h1>Principal-Led. Senior Throughout.</h1>
        <p className="inner-intro">
          Midochi is a principal-led desk. Every mandate is run directly by the principal, with no
          account managers and no dilution of judgment between the strategy and the execution.
          Clients work with the operator who designs the origination system.
        </p>
        <p className="inner-intro">
          This is a deliberate structure. The engagements we take on receive senior attention
          throughout, from first counterparty map to final named deal.
        </p>
      </section>

      <div className="inner-body">
        <section className="inner-section">
          <h2>How We Work</h2>
          <ul className="how-list">
            {HOW.map((item) => (
              <li key={item.h}>
                <strong>{item.h}</strong> {item.body}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="inner-close">
        <p className="close-note">We take on a handful of mandates each quarter.</p>
        <Link className="close-cta" href="/work-with-us">Work with us</Link>
      </section>

      <SiteFooter />
    </main>
  )
}
