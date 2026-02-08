import { ref } from 'vue'
import type { ApiEvent, ArticleDetail } from '../types/events'

export const useArticle = () => {
  const article = ref<ArticleDetail | null>(null)
  const articleEvent = ref<ApiEvent | null>(null)
  const articleLoading = ref(false)
  const articleError = ref('')

  const closeArticle = () => {
    article.value = null
    articleEvent.value = null
    articleError.value = ''
    articleLoading.value = false
  }

  const openArticle = async (event: ApiEvent) => {
    articleEvent.value = event
    articleLoading.value = true
    articleError.value = ''

    try {
      const url = encodeURIComponent(event.url)
      const response = await fetch(`/api/article?url=${url}`)
      if (!response.ok) {
        throw new Error('Kunde inte hamta artikel.')
      }
      const data = (await response.json()) as ArticleDetail
      article.value = data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ovantat fel uppstod.'
      articleError.value = message
    } finally {
      articleLoading.value = false
    }
  }

  return {
    article,
    articleEvent,
    articleLoading,
    articleError,
    openArticle,
    closeArticle,
  }
}
