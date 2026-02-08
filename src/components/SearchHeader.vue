<script setup lang="ts">
const props = defineProps<{
  query: string
  selectedType: string
  selectedDate: string
  types: string[]
  loading: boolean
  total: number
}>()
const emit = defineEmits<{
  (event: 'update:query', value: string): void
  (event: 'update:selectedType', value: string): void
  (event: 'update:selectedDate', value: string): void
  (event: 'refresh'): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:query', target?.value ?? '')
}

const onRefresh = () => {
  if (props.loading) return
  emit('refresh')
}

const onTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null
  emit('update:selectedType', target?.value ?? 'Alla')
}

const onDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:selectedDate', target?.value ?? '')
}

const clearDate = () => {
  emit('update:selectedDate', '')
}
</script>

<template>
  <header class="hero">
    <div class="hero__top">
      <span class="chip">Live</span>
      <button class="refresh" type="button" @click="onRefresh" :disabled="loading">
        Uppdatera
      </button>
    </div>
    <h1>Larmet</h1>
    <p>
      Snabba notiser fran raddningstjansten. Filtrera pa ort och se de senaste
      handelserna direkt..
    </p>
    <div class="search">
      <label for="search" class="sr-only">Sok pa ort</label>
      <input id="search" :value="query" type="search" placeholder="Sok pa ort, t.ex. Helsingborg" autocomplete="off"
        @input="onInput" />
      <label for="type" class="sr-only">Filtrera pa typ</label>
      <select id="type" :value="selectedType" @change="onTypeChange">
        <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
      </select>
      <label for="date" class="sr-only">Filtrera pa datum</label>
      <div class="date-field" :data-empty="selectedDate ? 'false' : 'true'">
        <span class="date-field__placeholder">Valj datum</span>
        <input id="date" type="date" :value="selectedDate" @input="onDateChange" />
        <button
          v-if="selectedDate"
          class="date-field__clear"
          type="button"
          aria-label="Nollstall datum"
          @click="clearDate"
        >
          Rensa
        </button>
      </div>
      <span class="search__hint">{{ total }} traffar</span>
    </div>
  </header>
</template>
