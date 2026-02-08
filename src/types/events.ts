export type ApiEvent = {
  id: number
  datetime: string
  name: string
  summary: string
  url: string
  type: string
  location?: {
    name: string
    gps: string
  }
}

export type ArticleDetail = {
  status: 'success' | 'error'
  title: string
  subtitle: string
  author: string
  published: string
  fullContent: string
  sourceUrl: string
}
