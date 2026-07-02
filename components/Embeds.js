'use client'

function blockContextMenu(e) {
  e.preventDefault()
}

export function YouTubeEmbed({ videoId, deckSlug }) {
  return (
    <div className="embed" data-embed="youtube" data-slug={deckSlug} onContextMenu={blockContextMenu}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&enablejsapi=1`}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export function SlidesEmbed({ src, deckSlug }) {
  return (
    <div className="embed" data-embed="slides" data-slug={deckSlug} onContextMenu={blockContextMenu}>
      <iframe src={src} title="Slides" allowFullScreen />
    </div>
  )
}
