import Link from 'next/link'
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'
import PracticeTabs from './PracticeTabs'
import { practices } from '../lib/practices'

export default function PracticePage({ slug }) {
  const p = practices[slug]

  return (
    <main className="home inner">
      <SiteNav />

      <section className="inner-hero">
        <span className="eyebrow">{p.label}</span>
        <h1>{p.headline}</h1>
        <p className="inner-intro">{p.intro}</p>
      </section>

      <PracticeTabs active={slug} />

      <div className="inner-body">
        {p.sections.map((s) => (
          <section className="inner-section" key={s.h}>
            <h2>{s.h}</h2>
            {s.body && <p>{s.body}</p>}
            {s.bulletsIntro && <p className="bullets-intro">{s.bulletsIntro}</p>}
            {s.bullets && (
              <ul className="dash-list">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="inner-close">
        <p className="close-note">We take on a handful of mandates each quarter.</p>
        <Link className="close-cta" href="/work-with-us">Work with us</Link>
      </section>

      <SiteFooter />
    </main>
  )
}
