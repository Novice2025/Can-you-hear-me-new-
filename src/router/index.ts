import { createRouter, createWebHistory } from 'vue-router'
import LessonView from '@/views/LessonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lesson',
      component: LessonView
    }
  ]
})

export default router
