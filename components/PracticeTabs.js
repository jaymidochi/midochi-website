import Link from 'next/link'

const TABS = [
  { slug: 'ai-infrastructure', label: 'AI Infrastructure' },
  { slug: 'enterprise-fintech', label: 'Enterprise Fintech' },
  { slug: 'private-longevity', label: 'Private Longevity' },
]

export default function PracticeTabs({ active }) {
  return (
    <nav className="practice-tabs">
      {TABS.map((t) => (
        <Link
          key={t.slug}
          href={`/${t.slug}`}
          className={t.slug === active ? 'tab active' : 'tab'}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
