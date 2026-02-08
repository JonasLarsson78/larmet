const POLISEN_BASE = 'https://polisen.se'
const CACHE_TTL_MS = 60 * 1000

const eventsCache = new Map()

const getCacheKey = (date) => date || 'all'

const getCachedEvents = (key) => {
  const entry = eventsCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    eventsCache.delete(key)
    return null
  }
  return entry.data
}

const setCachedEvents = (key, data) => {
  eventsCache.set(key, { data, timestamp: Date.now() })
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ status: 'error', message: 'Method not allowed.' })
    return
  }

  const rawDate = req.query?.date
  const date = Array.isArray(rawDate) ? rawDate[0] : rawDate || ''
  const cacheKey = getCacheKey(date)

  try {
    const cached = getCachedEvents(cacheKey)
    if (cached) {
      res.setHeader('x-cache', 'HIT')
      res.json(cached)
      return
    }

    const url = date ? `${POLISEN_BASE}/api/events?DateTime=${encodeURIComponent(date)}` : `${POLISEN_BASE}/api/events`
    const response = await fetch(url)
    if (!response.ok) {
      res.status(response.status).json({ status: 'error', message: 'Failed to fetch events.' })
      return
    }

    const data = await response.json()
    setCachedEvents(cacheKey, data)
    res.setHeader('x-cache', 'MISS')
    res.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ status: 'error', message })
  }
}
