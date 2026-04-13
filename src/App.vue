<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isTourRoute = computed(() => route.path === '/tour')

const basePath = import.meta.env.BASE_URL ?? '/'
const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`
const landingHref = `${normalizedBasePath}pages/landing/index.html`
</script>

<template>
  <div class="app-shell">
    <header class="app-shell__header">
      <nav class="app-shell__nav" aria-label="Main navigation">
        <a :href="landingHref">Home</a>
        <router-link to="/tour">3D Virtual Tour</router-link>
        <router-link to="/credits">Credits</router-link>
      </nav>
    </header>

    <main :class="['app-shell__main', { 'app-shell__main--tour': isTourRoute }]">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  --app-header-height: 74px;
}

.app-shell__header {
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.25rem;
}

.app-shell__nav {
  display: flex;
  gap: 1rem;
}

.app-shell__nav a {
  color: #1f2937;
  text-decoration: none;
  font-weight: 600;
}

.app-shell__nav a.router-link-active {
  text-decoration: underline;
}

.app-shell__main {
  padding: 1.25rem;
}

.app-shell__main--tour {
  padding: 0.5rem;
}
</style>
