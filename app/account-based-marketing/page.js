import { getSections } from '../../lib/content'
import { YouTubeEmbed, SlidesEmbed } from '../../components/Embeds'
import EngagementTracker from '../../components/EngagementTracker'

export const metadata = {
  title: 'Account-Based Marketing | Midochi',
}

export default function AbmPage() {
  const sections = getSections('abm')
  return (
    <main className="page">
      <EngagementTracker />
      {sections.map((section) => (
        <section key={section.slug} className="section" data-section={section.slug}>
          {section.title && section.slug === 'hero' ? (
            <div className="page-hero">
              <h1>{section.title}</h1>
            </div>
          ) : (
            section.title && <h2>{section.title}</h2>
          )}
          {section.segments.map((seg, i) => {
            if (seg.type === 'youtube') return <YouTubeEmbed key={i} videoId={seg.value} deckSlug={section.slug} />
            if (seg.type === 'slides') return <SlidesEmbed key={i} src={seg.value} deckSlug={section.slug} />
            return <div key={i} dangerouslySetInnerHTML={{ __html: seg.html }} />
          })}
        </section>
      ))}
    </main>
  )
}
