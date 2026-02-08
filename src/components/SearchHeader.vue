<script setup lang="ts">
const props = defineProps<{ query: string; loading: boolean; total: number }>()
const emit = defineEmits<{ (event: 'update:query', value: string): void; (event: 'refresh'): void }>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:query', target?.value ?? '')
}

const onRefresh = () => {
  if (props.loading) return
  emit('refresh')
}
</script>

<template>
  <header class="hero">
    <div class="hero__top">
      <span class="chip">Mobilfirst - Live</span>
      <button class="refresh" type="button" @click="onRefresh" :disabled="loading">
        Uppdatera
      </button>
    </div>
    <h1>Larmet</h1>
    <p>
      Snabba notiser fran raddningstjansten. Filtrera pa ort och se de senaste
      handelserna direkt.
    </p>
    <div class="search">
      <label for="search" class="sr-only">Sok pa ort</label>
      <input id="search" :value="query" type="search" placeholder="Sok pa ort, t.ex. Helsingborg" autocomplete="off"
        @input="onInput" />
      <span class="search__hint">{{ total }} traffar</span>
    </div>
  </header>
</template>
