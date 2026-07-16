import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">Midochi</div>
      <nav className="footer-links">
        <Link href="/ai-infrastructure">AI Infrastructure</Link>
        <Link href="/enterprise-fintech">Enterprise Fintech</Link>
        <Link href="/private-longevity">Private Longevity</Link>
        <Link href="/the-desk">The Desk</Link>
        <Link href="/work-with-us">Work With Us</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </footer>
  )
}
