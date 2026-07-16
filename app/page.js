import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export const metadata = {
  title: 'Midochi',
  description: 'An origination desk building private channels to win enterprise revenue.',
}

const pillars = [
  {
    h: 'Latent Demand Activation',
    body: 'The revenue you already own sits dormant: install bases, marquee logos, referral networks, strategic relationships. We convert it into named enterprise deals.',
  },
  {
    h: 'Institutional Access',
    body: 'We reach the counterparties who will never answer outreach, through the signals and relationships they already trust.',
  },
  {
    h: 'Capital Connections',
    body: 'When a mandate requires it, access to a private network of institutional investors and family offices.',
  },
]

const practices = [
  {
    href: '/ai-infrastructure',
    n: '01',
    label: 'AI Infrastructure',
    body: 'For infrastructure companies with real demand and no system to convert or defend it. We activate the latent enterprise demand you already carry, position you as the named vendor, and get you named before the market consolidates around a handful of names.',
  },
  {
    href: '/enterprise-fintech',
    n: '02',
    label: 'Enterprise Fintech',
    body: 'For financial infrastructure selling into institutions where deals are decided before the first call. We identify accounts before they choose an incumbent, move the whole buying committee, and turn curiosity trials into named, defensible deals.',
  },
  {
    href: '/private-longevity',
    n: '03',
    label: 'Private Longevity',
    body: 'For clinics whose highest-value clients arrive only through trust. We originate warm introductions to high-net-worth and family-office clients through the gatekeepers they already rely on, and hand you the channel.',
  },
]

export default function Home() {
  return (
    <main className="home">
      <SiteNav overlay />

      <section className="home-hero">
        <div className="home-hero-inner">
          <h1>Building private channels to win enterprise revenue.</h1>
          <p className="home-sub">
            Modern origination infrastructure. Principal-led execution. Measured outcomes.
          </p>
        </div>
      </section>

      <section className="intro">
        <span className="kicker">Positioning · Proximity · Performance</span>
        <p>
          Midochi is an origination desk for companies selling into markets that move on trust:
          enterprise technology, financial infrastructure, and private wealth. In these markets the
          decision is made before the vendor is ever in the room. The incumbent is chosen, the
          referral is made, the mandate is awarded. What looks like a pipeline problem is an access
          problem.
        </p>
        <p>
          We do not generate leads. We activate the demand you already own and reach the demand you
          cannot yet touch, converting both into named, defensible deals. Our work sits above the
          funnel, at the level where counterparties are identified, positioned, and moved. Every
          engagement is run by the principal, supported where a mandate calls for it by a private
          network of institutional investors and family offices. We bring more than advice. We bring
          access, positioning, and execution.
        </p>
      </section>

      <section className="pillars">
        {pillars.map((p) => (
          <article className="pillar" key={p.h}>
            <h3>{p.h}</h3>
            <p>{p.body}</p>
          </article>
        ))}
      </section>

      <section className="lines">
        <span className="kicker practices-kicker">Our Practices</span>
        {practices.map((l) => (
          <Link className="line line-link" key={l.n} href={l.href}>
            <span className="line-n">{l.n}</span>
            <div className="line-copy">
              <h2>{l.label}</h2>
              <p>{l.body}</p>
              <span className="line-more">Learn more</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="home-close">
        <p className="close-note">We take on a handful of mandates each quarter.</p>
        <Link className="close-cta" href="/work-with-us">Work with us</Link>
      </section>

      <SiteFooter />
    </main>
  )
}
