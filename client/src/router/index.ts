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
    path: '/artist/create',
    beforeEnter: [authenticate],
    name: 'ArtistCreate',
    component: () => import('../views/ArtistCreateView.vue'),
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
  {
    path: '/requests',
    name: 'Requests',
    component: () => import('../views/RequestsListView.vue')
  },
  {
    path: '/requests/band/update/:id',
    name: 'BandUpdateReq',
    component: () => import('../views/requests/BandUpdateReqView.vue')
  },
  {
    path: '/band/update/:id',
    name: 'BandUpdate',
    component: () => import('../views/BandUpdateView.vue')
  },
  {
    path: '/album/create/:id',
    beforeEnter: [authenticate],
    name: 'AlbumCreate',
    component: () => import('../views/CreateAlbumView.vue'),
  },
  {
    path: '/requests/album/create/:id',
    beforeEnter: [authenticate],
    name: 'AlbumCreateReq',
    component: () => import('../views/requests/AlbumCreateReqView.vue'),
  },
  {
    path: '/album/update/:id',
    name: 'AlbumUpdate',
    component: () => import('../views/AlbumUpdateView.vue')
  },
  {
    path: '/requests/artist/create/:id',
    beforeEnter: [authenticate],
    name: 'ArtistCreateReq',
    component: () => import('../views/requests/ArtistCreateReqView.vue'),
  },
  {
    path: '/requests/album/update/:id',
    name: 'AlbumUpdateReq',
    component: () => import('../views/requests/AlbumUpdateReqView.vue')
  },
  {
    path: '/artist/update/:id',
    name: 'ArtistUpdate',
    component: () => import('../views/ArtistUpdateView.vue')
  },
  {
    path: '/requests/artist/update/:id',
    name: 'ArtistUpdateReq',
    component: () => import('../views/requests/ArtistUpdateReqView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
