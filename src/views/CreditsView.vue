<script setup lang="ts">
import { computed } from 'vue'
import { credits } from '@virtual-tour/config/credits'

type CreditItem = {
  name: string
  url: string
  author: string
  license: string
}

const creditItems = computed<CreditItem[]>(() => {
  return Object.entries(credits).map(([name, item]) => ({
    name,
    url: item.url,
    author: item.author,
    license: item.license,
  }))
})
</script>

<template>
  <section class="credits-view" aria-label="Virtual zoo credits">
    <header class="credits-view__header">
      <h1 class="credits-view__title">Virtual Zoo Credits</h1>
      <p class="credits-view__lead">
        Attribution for all external 3D models and textures used in the virtual zoo.
      </p>
      <router-link class="credits-view__back" to="/tour">Back to Virtual Tour</router-link>
    </header>

    <ul class="credits-view__list">
      <li v-for="item in creditItems" :key="item.name" class="credits-view__item">
        <h2 class="credits-view__item-title">{{ item.name }}</h2>
        <p class="credits-view__meta">Author: <span>{{ item.author }}</span></p>
        <p class="credits-view__meta">License: <span>{{ item.license }}</span></p>
        <a
          class="credits-view__link"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open source
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.credits-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.5rem 0 1.5rem;
}

.credits-view__header {
  margin-bottom: 1.5rem;
}

.credits-view__title {
  margin: 0;
  font-size: 2rem;
  line-height: 1.2;
  color: #20113d;
}

.credits-view__lead {
  margin: 0.75rem 0 1rem;
  color: #000000;
  line-height: 1.5;
  max-width: 680px;
}

.credits-view__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.2rem;
  border-radius: 6px;
  background: #00a092;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
}

.credits-view__back:hover {
  filter: brightness(0.95);
}

.credits-view__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.credits-view__item {
  border: 1px solid #20113d;
  border-left: 4px solid #f58021;
  border-radius: 10px;
  padding: 1rem;
  background: #ffffff;
}

.credits-view__item-title {
  margin: 0 0 0.6rem;
  font-size: 1.1rem;
  color: #20113d;
}

.credits-view__meta {
  margin: 0.25rem 0;
  line-height: 1.4;
  color: #000000;
}

.credits-view__meta span {
  font-weight: 600;
}

.credits-view__link {
  display: inline-block;
  margin-top: 0.75rem;
  color: #00a092;
  font-weight: 700;
}

@media (max-width: 640px) {
  .credits-view {
    padding: 0.25rem 0 1rem;
  }

  .credits-view__title {
    font-size: 1.65rem;
  }
}
</style>
