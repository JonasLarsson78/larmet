<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type ApiEvent = {
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

const formatDate = (value: string) => {
  const parts = value.split(' ')[0]?.split('-') ?? []
  if (parts.length !== 3) return value
  const [year, month, day] = parts
  return `${day}.${month}.${year}`
}

const openUrl = (event: ApiEvent) => {
  const baseUrl = 'https://polisen.se'
  const url = event.url?.startsWith('http') ? event.url : `${baseUrl}${event.url}`
  window.open(url, '_blank', 'noopener')
}

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
</script>

<template>
  <div class="page">
    <header class="hero">
      <div class="hero__top">
        <span class="chip">Mobilfirst - Live</span>
        <button class="refresh" type="button" @click="fetchEvents" :disabled="loading">
          Uppdatera
        </button>
      </div>
      <h1>Larmkollen</h1>
      <p>
        Snabba notiser fran raddningstjansten. Filtrera pa ort och se de senaste
        handelserna direkt.
      </p>
      <div class="search">
        <label for="search" class="sr-only">Sok pa ort</label>
        <input id="search" v-model="query" type="search" placeholder="Sok pa ort, t.ex. Helsingborg"
          autocomplete="off" />
        <span class="search__hint">{{ filteredEvents.length }} traffar</span>
      </div>
    </header>

    <main class="content">
      <section class="status" v-if="loading || errorMessage">
        <p v-if="loading">Hamta senaste larm...</p>
        <p v-else class="status__error">{{ errorMessage }}</p>
      </section>

      <section class="cards" v-else>
        <article v-for="event in filteredEvents" :key="event.id" class="card" @click="openUrl(event)" role="button"
          tabindex="0" @keydown.enter="openUrl(event)">
          <div class="card__meta">
            <span class="card__type">{{ event.type }}</span>
            <span class="card__time">{{ formatDate(event.datetime) }}</span>
          </div>
          <h2>{{ event.name }}</h2>
          <p>{{ event.summary }}</p>
          <div class="card__footer">
            <span class="card__location">{{ event.location?.name ?? 'Plats okand' }}</span>
            <span class="card__cta">Las mer -></span>
          </div>
        </article>

        <div v-if="filteredEvents.length === 0" class="empty">
          <h3>Inga larm just nu.</h3>
          <p>Testa en annan ort eller uppdatera listan.</p>
        </div>
      </section>
    </main>
  </div>
</template>
