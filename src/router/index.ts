import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: (to) => {
        return { path: '/default' }
      },
    },
    {
      path: '/default',
      name: 'Default',
      component: () => import('../templates/default/Index.vue'),
    },
    {
      path: '/default/:j',
      name: 'Defaultj',
      component: () => import('../templates/default/Index.vue'),
    },
    {
      path: '/landing',
      name: 'Landing',
      component: () => import('../templates/landing/Index.vue'),
    },
    {
      path: '/landing/:j',
      name: 'Landingj',
      component: () => import('../templates/landing/Index.vue'),
    },
  ],
})

export default router
