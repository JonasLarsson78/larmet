import * as cheerio from 'cheerio'

const POLISEN_BASE = 'https://polisen.se'

const isAllowedPolisenUrl = (url) => {
  if (!url) return false
  if (url.startsWith(POLISEN_BASE)) return true
  if (url.startsWith('/aktuellt/')) return true
  return false
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ status: 'error', message: 'Method not allowed.' })
    return
  }

  const rawUrl = req.query?.url
  const url = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl || ''

  if (!isAllowedPolisenUrl(url)) {
    res.status(400).json({ status: 'error', message: 'Invalid url.' })
    return
  }

  const fullUrl = url.startsWith('http') ? url : `${POLISEN_BASE}${url}`

  try {
    const pageResponse = await fetch(fullUrl)
    if (!pageResponse.ok) {
      res.status(pageResponse.status).json({ status: 'error', message: 'Failed to fetch page.' })
      return
    }

    const html = await pageResponse.text()
    const $ = cheerio.load(html)

    const articleContent =
      $('.editorial-html').text().trim() || $('article').text().trim() || $('.content').text().trim()

    const title =
      $('h1.heading-xl').text().trim() || $('h1').first().text().trim() || 'Okand rubrik'

    const subtitle =
      $('.preamble').text().trim() || $('h2').first().text().trim() || $('.lead').text().trim()

    const author = $('.published-container span').eq(1).text().trim() || ''

    const published = $('time').text().trim() || $('.published-date').text().trim() || ''

    res.json({
      status: 'success',
      title,
      subtitle,
      author,
      published,
      fullContent: articleContent,
      sourceUrl: fullUrl,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ status: 'error', message })
  }
}
