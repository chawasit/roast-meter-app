import { createRouter, createWebHistory } from 'vue-router'
import LogView from '../views/LogView.vue'
import SettingView from '../views/SettingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'logging',
      component: LogView
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView
    }
  ],
  linkActiveClass: 'is-active'
})

export default router
