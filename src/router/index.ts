import { useMeterStore } from '@/stores/roastMeter'
import { createRouter, createWebHistory } from 'vue-router'
import { useCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'meter',
      component: () => import('@/views/MeterView.vue')
    },
    {
      path: '/roast-profiles',
      name: 'roast_profiles',
      component: () => import('@/views/RoastProfilesView.vue')
    },
    {
      path: '/save-roast-profile/:agtron',
      name: 'save_roast_profile',
      component: () => import('@/views/SaveRoastProfileView.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/SettingView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    }
  ],
  linkActiveClass: 'is-active'
})

router.beforeEach((to, from, next) => {
  const user = useCurrentUser()
  const meterStore = useMeterStore()

  if (to.name !== 'login' && to.name !== 'meter' && to.name !== 'setting' && !user.value) {
    next({ name: 'login' })
    return;
  }
  if (to.name == 'setting' && !meterStore.isConnected) {
    next({ name: 'meter' })
    return;
  }

  // if the user is not authenticated, `next` is called twice
  next()
})

export default router
