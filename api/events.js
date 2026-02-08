const POLISEN_BASE = 'https://polisen.se'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ status: 'error', message: 'Method not allowed.' })
    return
  }

  try {
    const response = await fetch(`${POLISEN_BASE}/api/events`)
    if (!response.ok) {
      res.status(response.status).json({ status: 'error', message: 'Failed to fetch events.' })
      return
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ status: 'error', message })
  }
}
