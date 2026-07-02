import crypto from 'crypto'

const POSTHOG_HOST = 'https://us.i.posthog.com'
const POSTHOG_KEY = 'phc_o0E11JnVZcSvn5mKMbhwKJSRy0eeY2IaLY0Ja1MI3Mp'
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
// posthog-js anonymous distinct IDs are UUID-shaped
const DISTINCT_ID_RE = /Distinct ID:\s*`?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`?/i

const ok = () => new Response('ok', { status: 200 })

function verifySlackSignature(rawBody, headers) {
  const secret = process.env.SLACK_SIGNING_SECRET
  if (!secret) return false
  const ts = headers.get('x-slack-request-timestamp')
  const sig = headers.get('x-slack-signature')
  if (!ts || !sig) return false
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false // replay guard
  const base = `v0:${ts}:${rawBody}`
  const expected = 'v0=' + crypto.createHmac('sha256', secret).update(base).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}

async function slack(method, payload) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

async function react(channel, ts, name) {
  await slack('reactions.add', { channel, timestamp: ts, name })
}

async function replyInThread(channel, threadTs, text) {
  await slack('chat.postMessage', { channel, thread_ts: threadTs, text })
}

export async function POST(req) {
  const raw = await req.text()

  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return new Response('bad request', { status: 400 })
  }

  // Slack's one-time endpoint verification handshake
  if (body.type === 'url_verification') {
    return Response.json({ challenge: body.challenge })
  }

  if (!verifySlackSignature(raw, req.headers)) {
    return new Response('invalid signature', { status: 401 })
  }

  // Slack retries on slow responses; the first attempt already handled it
  if (req.headers.get('x-slack-retry-num')) return ok()

  const event = body.event
  // Only thread replies (not the parent message itself), only from Jay
  if (
    body.type !== 'event_callback' ||
    event?.type !== 'message' ||
    event.subtype || // ignore edits, bot messages, etc.
    !event.thread_ts ||
    event.thread_ts === event.ts ||
    event.user !== process.env.SLACK_ALLOWED_USER_ID
  ) {
    return ok()
  }

  const emailMatch = (event.text || '').match(EMAIL_RE)
  if (!emailMatch) return ok()
  const email = emailMatch[0].toLowerCase()

  // Pull the parent visit alert to find the anonymous distinct ID.
  // Read methods take query params, not a JSON body.
  const params = new URLSearchParams({ channel: event.channel, ts: event.thread_ts, limit: '1' })
  const parent = await fetch(`https://slack.com/api/conversations.replies?${params}`, {
    headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
  }).then((r) => r.json())
  const parentText = JSON.stringify(parent.messages?.[0] || {})
  const idMatch = parentText.match(DISTINCT_ID_RE)
  if (!idMatch) {
    await react(event.channel, event.ts, 'x')
    const diag = parent.ok
      ? `parent found: ${parent.messages?.length > 0}, text starts: "${parentText.slice(0, 120)}"`
      : `Slack API error: ${parent.error}`
    await replyInThread(event.channel, event.thread_ts, `No distinct ID found in the parent message. Debug: ${diag}`)
    return ok()
  }
  const anonDistinctId = idMatch[1]

  // Merge: all events from the anonymous device become this email's history
  const phRes = await fetch(`${POSTHOG_HOST}/i/v0/e/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: '$identify',
      distinct_id: email,
      properties: {
        $anon_distinct_id: anonDistinctId,
        $set: { email, identified_via: 'slack_thread_reply' },
      },
    }),
  })

  if (phRes.ok) {
    await react(event.channel, event.ts, 'white_check_mark')
  } else {
    await react(event.channel, event.ts, 'x')
    await replyInThread(event.channel, event.thread_ts, `PostHog rejected the merge (HTTP ${phRes.status}).`)
  }

  return ok()
}
