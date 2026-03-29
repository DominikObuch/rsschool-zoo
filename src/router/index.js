import { createRouter, createWebHistory } from 'vue-router'

const MainScene = () => import('../../components/virtual-tour/MainScene.vue')
const CreditsView = () => import('../views/CreditsView.vue')

const LandingRedirectView = {
  name: 'LandingRedirectView',
  setup() {
    const basePath = import.meta.env.BASE_URL ?? '/'
    const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`
    window.location.replace(`${normalizedBasePath}pages/landing/index.html`)
    return () => null
  },
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingRedirectView,
    },
    {
      path: '/tour',
      name: 'main-scene',
      component: MainScene,
    },
    {
      path: '/credits',
      name: 'credits',
      component: CreditsView,
    },
    {
      path: '/pages/virtual-tour',
      redirect: '/tour',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
