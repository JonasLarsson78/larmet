<script setup lang="ts">
import ArticleModal from './components/ArticleModal.vue'
import EventList from './components/EventList.vue'
import SearchHeader from './components/SearchHeader.vue'
import { useArticle } from './composables/useArticle'
import { useEvents } from './composables/useEvents'

const { filteredEvents, loading, errorMessage, query, selectedType, availableTypes, fetchEvents } = useEvents()
const { article, articleEvent, articleLoading, articleError, openArticle, closeArticle } = useArticle()
</script>

<template>
  <div class="page">
    <SearchHeader v-model:query="query" v-model:selectedType="selectedType" :types="availableTypes" :loading="loading"
      :total="filteredEvents.length" @refresh="fetchEvents" />

    <main class="content">
      <section class="status" v-if="loading || errorMessage">
        <p v-if="loading">Hamta senaste larm...</p>
        <p v-else class="status__error">{{ errorMessage }}</p>
      </section>

      <EventList v-else :events="filteredEvents" @open="openArticle" />
    </main>

    <ArticleModal :open="Boolean(articleEvent)" :loading="articleLoading" :error="articleError" :article="article"
      :event="articleEvent" @close="closeArticle" />
  </div>
</template>
