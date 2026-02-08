import { computed, onMounted, ref, watch } from 'vue'
import type { ApiEvent } from '../types/events'

export const useEvents = () => {
  const events = ref<ApiEvent[]>([])
  const loading = ref(false)
  const errorMessage = ref('')
  const query = ref('')
  const selectedType = ref('Alla')
  const selectedDate = ref('')

  const syncFromUrl = () => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const city = params.get('city')
    const type = params.get('type')
    const date = params.get('date')
    if (city) query.value = city
    if (type) selectedType.value = type
    if (date) selectedDate.value = date
  }

  const syncToUrl = () => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (query.value.trim()) {
      params.set('city', query.value.trim())
    } else {
      params.delete('city')
    }
    if (selectedType.value && selectedType.value !== 'Alla') {
      params.set('type', selectedType.value)
    } else {
      params.delete('type')
    }
    if (selectedDate.value) {
      params.set('date', selectedDate.value)
    } else {
      params.delete('date')
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`
    window.history.replaceState(null, '', newUrl)
  }

  const availableTypes = computed(() => {
    const unique = new Set<string>()
    events.value.forEach((event) => {
      if (event.type) unique.add(event.type)
    })
    return ['Alla', ...Array.from(unique).sort((a, b) => a.localeCompare(b))]
  })

  const filteredEvents = computed(() => {
    const term = query.value.trim().toLowerCase()
    const typeFilter = selectedType.value
    const dateFilter = selectedDate.value

    return events.value.filter((event: ApiEvent) => {
      const matchesType = typeFilter === 'Alla' || event.type === typeFilter
      const eventDate = event.datetime?.split(' ')[0] ?? ''
      const matchesDate = !dateFilter || eventDate === dateFilter
      const name = event.name?.toLowerCase() ?? ''
      const summary = event.summary?.toLowerCase() ?? ''
      const location = event.location?.name?.toLowerCase() ?? ''
      const matchesTerm = !term || name.includes(term) || summary.includes(term) || location.includes(term)
      return matchesType && matchesDate && matchesTerm
    })
  })

  const fetchEvents = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const params = new URLSearchParams()
      if (selectedDate.value) {
        params.set('date', selectedDate.value)
      }
      const response = await fetch(`/api/events${params.toString() ? `?${params}` : ''}`)
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
    syncFromUrl()
    void fetchEvents()
  })

  watch([query, selectedType, selectedDate], () => {
    syncToUrl()
  })

  watch(selectedDate, () => {
    void fetchEvents()
  })

  return {
    events,
    loading,
    errorMessage,
    query,
    selectedType,
    selectedDate,
    availableTypes,
    filteredEvents,
    fetchEvents,
  }
}
