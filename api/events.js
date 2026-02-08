const POLISEN_BASE = 'https://polisen.se'
const CACHE_TTL_MS = 60 * 1000

let cachedEvents = null
let cachedAt = 0

const isCacheValid = () => cachedEvents && Date.now() - cachedAt < CACHE_TTL_MS

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ status: 'error', message: 'Method not allowed.' })
    return
  }

  try {
    if (isCacheValid()) {
      res.setHeader('x-cache', 'HIT')
      res.json(cachedEvents)
      return
    }

    const response = await fetch(`${POLISEN_BASE}/api/events`)
    if (!response.ok) {
      res.status(response.status).json({ status: 'error', message: 'Failed to fetch events.' })
      return
    }

    const data = await response.json()
    cachedEvents = data
    cachedAt = Date.now()
    res.setHeader('x-cache', 'MISS')
    res.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ status: 'error', message })
  }
}
