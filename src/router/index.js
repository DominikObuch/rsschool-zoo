import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')

const VirtualTour = () => import('../../components/virtual-tour/VirtualTour.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tour',
      name: 'tour',
      component: VirtualTour,
    },
  ],
})

export default router
