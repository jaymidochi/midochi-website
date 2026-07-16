import Link from 'next/link'

const NAV = [
  { href: '/ai-infrastructure', label: 'AI Infrastructure' },
  { href: '/enterprise-fintech', label: 'Enterprise Fintech' },
  { href: '/private-longevity', label: 'Private Longevity' },
  { href: '/the-desk', label: 'The Desk' },
]

export default function SiteNav({ overlay = false }) {
  return (
    <header className={overlay ? 'site-nav overlay' : 'site-nav'}>
      <Link href="/" className="wordmark">Midochi</Link>
      <nav className="nav-links">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href}>{n.label}</Link>
        ))}
        <Link href="/work-with-us" className="enquire">Enquire</Link>
      </nav>
    </header>
  )
}
