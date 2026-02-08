import { computed, onMounted, ref } from 'vue'
import type { ApiEvent } from '../types/events'

export const useEvents = () => {
  const events = ref<ApiEvent[]>([])
  const loading = ref(false)
  const errorMessage = ref('')
  const query = ref('')

  const filteredEvents = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return events.value

    return events.value.filter((event: ApiEvent) => {
      const name = event.name?.toLowerCase() ?? ''
      const summary = event.summary?.toLowerCase() ?? ''
      const location = event.location?.name?.toLowerCase() ?? ''
      return name.includes(term) || summary.includes(term) || location.includes(term)
    })
  })

  const fetchEvents = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await fetch('/api/events')
      if (!response.ok) {
        throw new Error('Kunde inte hamta data fran API.')
      }
      const data = (await response.json()) as ApiEvent[]
      events.value = data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ovantat fel uppstod.'
      errorMessage.value = message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void fetchEvents()
  })

  return {
    events,
    loading,
    errorMessage,
    query,
    filteredEvents,
    fetchEvents,
  }
}
