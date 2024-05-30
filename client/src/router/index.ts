import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/band/create',
    name: 'BandCreate',
    component: () => import('../views/BandCreateView.vue'),
  },
  {
    path: '/band/:id',
    name: 'Band',
    component: () => import('../views/BandView.vue'),
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: () => import('../views/AlbumView.vue'),
  },
  {
    path: '/album/review/:id',
    name: 'ReviewCreate',
    component: () => import('../views/ReviewCreateView.vue'),
  },
  {
    path: '/review/:id',
    name: 'Review',
    component: () => import('../views/ReviewView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
