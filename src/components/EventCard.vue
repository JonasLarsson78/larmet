<script setup lang="ts">
import type { ApiEvent } from '../types/events'

const props = defineProps<{ event: ApiEvent }>()
const emit = defineEmits<{ (event: 'open', value: ApiEvent): void }>()

const formatDate = (value: string) => {
  const parts = value.split(' ')[0]?.split('-') ?? []
  if (parts.length !== 3) return value
  const [year, month, day] = parts
  return `${day}.${month}.${year}`
}

const open = () => {
  emit('open', props.event)
}
</script>

<template>
  <article class="card" role="button" tabindex="0" @click="open" @keydown.enter="open">
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
</template>
