import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const MainScene = () => import('../../components/virtual-tour/MainScene.vue')

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
      name: 'main-scene',
      component: MainScene,
    },
    {
      path: '/pages/virtual-tour',
      redirect: '/tour',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/tour',
    },
  ],
})

export default router
