import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/DefaultView.vue'),
    },
    {
      path: '/default',
      name: 'Default',
      component: () => import('../templates/default/Index.vue'),
    },
    {
      path: '/default/:j',
      name: 'DefaultSdf',
      component: () => import('../templates/default/Index.vue'),
    },
    {
      path: '/hello/:j',
      name: 'HelloSdf',
      component: () => import('../components/HelloWorld.vue'),
    },
    {
      path: '/hello',
      name: 'Hello',
      component: () => import('../components/HelloWorld.vue'),
    },
  ],
})

export default router
