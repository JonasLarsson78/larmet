<script setup lang="ts">
import { computed } from 'vue'
import type { ApiEvent, ArticleDetail } from '../types/events'

const props = defineProps<{
  open: boolean
  loading: boolean
  error: string
  article: ArticleDetail | null
  event: ApiEvent | null
}>()

const dialogLabel = computed(() => {
  if (props.article?.title) return props.article.title
  if (props.event?.name) return props.event.name
  return 'Artikel'
})

const emit = defineEmits<{ (event: 'close'): void }>()

const close = () => {
  emit('close')
}
</script>

<template>
  <div v-if="open" class="modal" role="dialog" aria-modal="true" :aria-label="dialogLabel">
    <div class="modal__backdrop" @click="close"></div>
    <div class="modal__panel">
      <button class="modal__close" type="button" @click="close">Stang</button>
      <div v-if="loading" class="modal__status">Hamta artikel...</div>
      <div v-else-if="error" class="modal__status modal__status--error">{{ error }}</div>
      <div v-else-if="article" class="modal__body">
        <p class="modal__eyebrow">{{ event?.type ?? 'Larm' }}</p>
        <h2>{{ article.title || event?.name }}</h2>
        <p v-if="article.subtitle" class="modal__subtitle">{{ article.subtitle }}</p>
        <div class="modal__meta">
          <span v-if="article.published">{{ article.published }}</span>
          <span v-if="article.author">{{ article.author }}</span>
        </div>
        <p class="modal__content">{{ article.fullContent }}</p>
        <a class="modal__link" :href="article.sourceUrl" target="_blank" rel="noopener">Kalla</a>
      </div>
    </div>
  </div>
</template>
