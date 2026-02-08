<script setup lang="ts">
import type { ApiEvent } from '../types/events'
import EventCard from './EventCard.vue'

defineProps<{ events: ApiEvent[] }>()
const emit = defineEmits<{ (event: 'open', value: ApiEvent): void }>()

const onOpen = (event: ApiEvent) => {
  emit('open', event)
}
</script>

<template>
  <section class="cards">
    <EventCard v-for="event in events" :key="event.id" :event="event" @open="onOpen" />

    <div v-if="events.length === 0" class="empty">
      <h3>Inga larm just nu.</h3>
      <p>Testa en annan ort eller uppdatera listan.</p>
    </div>
  </section>
</template>
