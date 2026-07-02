import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Splits markdown into segments of html and embed shortcodes:
// {{slides:EMBED_URL}} and {{youtube:VIDEO_ID}}
const SHORTCODE = /\{\{(slides|youtube):([^}]+)\}\}/g

function parseSegments(markdown) {
  const segments = []
  let last = 0
  for (const m of markdown.matchAll(SHORTCODE)) {
    const before = markdown.slice(last, m.index).trim()
    if (before) segments.push({ type: 'html', html: marked.parse(before) })
    segments.push({ type: m[1], value: m[2].trim() })
    last = m.index + m[0].length
  }
  const rest = markdown.slice(last).trim()
  if (rest) segments.push({ type: 'html', html: marked.parse(rest) })
  return segments
}

export function getSections(collection) {
  const dir = path.join(CONTENT_DIR, collection)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      const slug = file.replace(/^\d+-/, '').replace(/\.md$/, '')
      return {
        slug,
        title: data.title || null,
        segments: parseSegments(content),
      }
    })
}
