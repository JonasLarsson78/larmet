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

const normalizeType = (value: string) => value.trim().toLowerCase()

const typeMatchers = [
  { match: 'brand', color: '#c1121f', bg: 'rgba(193, 18, 31, 0.16)' },
  { match: 'trafikolycka', color: '#0f766e', bg: 'rgba(15, 118, 110, 0.18)' },
  { match: 'olycka', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.18)' },
  { match: 'skottlossning', color: '#7f1d1d', bg: 'rgba(127, 29, 29, 0.2)' },
  { match: 'misshandel', color: '#7c2d12', bg: 'rgba(124, 45, 18, 0.18)' },
  { match: 'mord', color: '#3f0d12', bg: 'rgba(63, 13, 18, 0.2)' },
  { match: 'valdtakt', color: '#4c0519', bg: 'rgba(76, 5, 25, 0.2)' },
  { match: 'vapen', color: '#4a044e', bg: 'rgba(74, 4, 78, 0.18)' },
  { match: 'forsvunnen', color: '#1e293b', bg: 'rgba(30, 41, 59, 0.18)' },
  { match: 'efterlyst', color: '#334155', bg: 'rgba(51, 65, 85, 0.18)' },
  { match: 'bedrageri', color: '#0f172a', bg: 'rgba(15, 23, 42, 0.16)' },
  { match: 'bedragerier', color: '#0f172a', bg: 'rgba(15, 23, 42, 0.16)' },
  { match: 'narkotika', color: '#0f766e', bg: 'rgba(15, 118, 110, 0.18)' },
  { match: 'alkohol', color: '#6d28d9', bg: 'rgba(109, 40, 217, 0.18)' },
  { match: 'stold', color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.18)' },
  { match: 'stold,', color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.18)' },
  { match: 'cykelstold', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.18)' },
  { match: 'skadegorelse', color: '#b45309', bg: 'rgba(180, 83, 9, 0.18)' },
  { match: 'arbetsplats', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.18)' },
  { match: 'brak', color: '#9a3412', bg: 'rgba(154, 52, 18, 0.18)' },
  { match: 'brak,', color: '#9a3412', bg: 'rgba(154, 52, 18, 0.18)' },
  { match: 'pafoljd', color: '#1f2937', bg: 'rgba(31, 41, 55, 0.18)' },
  { match: 'samhalle', color: '#0f766e', bg: 'rgba(15, 118, 110, 0.18)' },
  { match: 'fjallraddning', color: '#0369a1', bg: 'rgba(3, 105, 161, 0.18)' },
  { match: 'sjofart', color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.18)' },
  { match: 'glatt', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.18)' },
  { match: 'trafik', color: '#0f766e', bg: 'rgba(15, 118, 110, 0.18)' },
  { match: 'ovader', color: '#0f172a', bg: 'rgba(15, 23, 42, 0.16)' },
  { match: 'brandlarm', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.18)' },
  { match: 'ras', color: '#b45309', bg: 'rgba(180, 83, 9, 0.18)' },
  { match: 'forvarnad', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.18)' },
  { match: 'arbete', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.18)' },
  { match: 'farligt foremal', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.18)' },
  { match: 'farligt', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.18)' },
  { match: 'ran', color: '#6d28d9', bg: 'rgba(109, 40, 217, 0.18)' },
  { match: 'inbrott', color: '#1f4e79', bg: 'rgba(31, 78, 121, 0.18)' },
  { match: 'explosion', color: '#b45309', bg: 'rgba(180, 83, 9, 0.18)' },
  { match: 'drunkning', color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.18)' },
  { match: 'ovrigt', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.18)' },
]

const getTypeStyle = (type: string) => {
  const key = normalizeType(type)
  const palette = typeMatchers.find((entry) => key.includes(entry.match))
  if (!palette) return { '--type-color': '#a51422', '--type-bg': 'rgba(225, 29, 46, 0.16)' }
  return { '--type-color': palette.color, '--type-bg': palette.bg }
}

const open = () => {
  emit('open', props.event)
}
</script>

<template>
  <article class="card" role="button" tabindex="0" @click="open" @keydown.enter="open"
    :style="getTypeStyle(event.type)">
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
