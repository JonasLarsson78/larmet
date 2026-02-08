<script setup lang="ts">
import ArticleModal from './components/ArticleModal.vue'
import EventList from './components/EventList.vue'
import SearchHeader from './components/SearchHeader.vue'
import { useArticle } from './composables/useArticle'
import { useEvents } from './composables/useEvents'
import pkg from '../package.json'

const { filteredEvents, loading, errorMessage, query, selectedType, selectedDate, availableTypes, fetchEvents } =
  useEvents()
const { article, articleEvent, articleLoading, articleError, openArticle, closeArticle } = useArticle()
const appVersion = pkg.version ?? '1.0.0'
</script>

<template>
  <div class="page">
    <SearchHeader v-model:query="query" v-model:selectedType="selectedType" v-model:selectedDate="selectedDate"
      :types="availableTypes" :loading="loading" :total="filteredEvents.length" @refresh="fetchEvents" />

    <main class="content">
      <section class="status" v-if="loading || errorMessage">
        <p v-if="loading">Hamta senaste larm...</p>
        <p v-else class="status__error">{{ errorMessage }}</p>
      </section>

      <EventList v-else :events="filteredEvents" @open="openArticle" />
    </main>

    <ArticleModal :open="Boolean(articleEvent)" :loading="articleLoading" :error="articleError" :article="article"
      :event="articleEvent" @close="closeArticle" />

    <footer class="footer">
      <div class="footer__links">
        <a class="footer__icon" href="mailto:jl.7804@gmail.com" aria-label="Email">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <rect x="3" y="6" width="18" height="12" rx="2.5" fill="currentColor" />
            <path d="M5 8.5 12 13l7-4.5" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </a>
        <a class="footer__icon" href="https://github.com/JonasLarsson78/larmet" target="_blank" rel="noopener"
          aria-label="GitHub">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 3c-5 0-9 3.6-9 8.1 0 3.5 2.2 6.4 5.4 7.5.4.1.6-.2.6-.5v-1.7c-2.2.5-2.7-.9-2.7-.9-.4-1-1-1.2-1-1.2-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.2 2.1.9 2.6.7.1-.6.3-1 .6-1.2-1.8-.2-3.7-.8-3.7-3.7 0-.8.3-1.5.8-2-.1-.2-.3-1 .1-2 0 0 .7-.2 2.2.8.7-.2 1.5-.3 2.2-.3s1.5.1 2.2.3c1.5-1 2.2-.8 2.2-.8.4 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.9-1.9 3.5-3.7 3.7.4.3.7.9.7 1.8v2.1c0 .3.2.6.6.5 3.2-1.1 5.4-4 5.4-7.5C21 6.6 17 3 12 3z"
              fill="currentColor" />
          </svg>
        </a>
        <a class="footer__icon" href="https://www.linkedin.com/in/jonlarsson/" target="_blank" rel="noopener"
          aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
            <path
              d="M8.2 9.2h1.9v6.6H8.2V9.2zm.9-3.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12.1 9.2h1.8v.9c.3-.5.9-1 2-1 1.6 0 2.4 1 2.4 2.8v4H16v-3.5c0-.9-.3-1.5-1.1-1.5-.6 0-.9.4-1.1.8-.1.2-.1.4-.1.7v3.5h-1.8V9.2z"
              fill="white" />
          </svg>
        </a>
      </div>
      <div class="footer__meta">
        <span>v{{ appVersion }}</span>
        <span>Larmet © 2026 Jonas Larsson</span>
      </div>
    </footer>
  </div>
</template>
