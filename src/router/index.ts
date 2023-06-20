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
      name: 'Hello',
      component: () => import('../components/HelloWorld.vue'),
    },
    {
      path: '/hello',
      name: 'HelloEmpty',
      component: () => import('../components/HelloWorld.vue'),
    },
    {
      path: '/colors',
      name: 'colors',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ColorsView.vue'),
    },
  ],
})

export default router
