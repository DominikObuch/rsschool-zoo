<template>
  <div class="app-shell">
    <header class="app-shell__header">
      <nav class="app-shell__nav" aria-label="Main navigation">
        <router-link to="/">Home</router-link>
        <router-link to="/tour">3D Virtual Tour</router-link>
      </nav>
    </header>

    <main class="app-shell__main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
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
</style>
