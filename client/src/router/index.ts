import { createRouter, createWebHistory } from 'vue-router'
import { authenticate } from './guards'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/band/create',
    beforeEnter: [authenticate],
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
    beforeEnter: [authenticate],
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
  {
    path: '/artist/:id',
    name: 'Artist',
    component: () => import('../views/ArtistView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
