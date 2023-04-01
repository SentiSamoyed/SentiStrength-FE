import { createRouter, createWebHistory } from 'vue-router'
import AnalyseView from '@/views/AnalyseView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }, {
      path: '/analyse',
      name: 'analyse',
      component: AnalyseView
    }
  ]
})

export default router
