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
    component: () => import('../views/band/BandCreate.vue'),
  },
  {
    path: '/artist/create',
    beforeEnter: [authenticate],
    name: 'ArtistCreate',
    component: () => import('../views/artist/ArtistCreate.vue'),
  },
  {
    path: '/band/:id',
    name: 'Band',
    component: () => import('../views/band/BandView.vue'),
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: () => import('../views/album/AlbumView.vue'),
  },
  {
    path: '/album/review/:id',
    beforeEnter: [authenticate],
    name: 'ReviewCreate',
    component: () => import('../views/review/ReviewCreate.vue'),
  },
  {
    path: '/review/:id',
    name: 'Review',
    component: () => import('../views/review/ReviewView.vue'),
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
    component: () => import('../views/artist/ArtistView.vue'),
  },
  {
    path: '/requests',
    name: 'Requests',
    component: () => import('../views/RequestsView.vue'),
  },
  {
    path: '/requests/band/update/:id',
    name: 'BandUpdateReq',
    component: () => import('../views/band/RequestUpdateBand.vue'),
  },
  {
    path: '/band/update/:id',
    name: 'BandUpdate',
    component: () => import('../views/band/BandUpdate.vue'),
  },
  {
    path: '/album/create/:id',
    beforeEnter: [authenticate],
    name: 'AlbumCreate',
    component: () => import('../views/album/AlbumCreate.vue'),
  },
  {
    path: '/requests/album/create/:id',
    beforeEnter: [authenticate],
    name: 'AlbumCreateReq',
    component: () => import('../views/album/RequestCreateAlbum.vue'),
  },
  {
    path: '/album/update/:id',
    name: 'AlbumUpdate',
    component: () => import('../views/album/AlbumUpdate.vue'),
  },
  {
    path: '/requests/artist/create/:id',
    beforeEnter: [authenticate],
    name: 'ArtistCreateReq',
    component: () => import('../views/artist/RequestCreateArtist.vue'),
  },
  {
    path: '/requests/album/update/:id',
    name: 'AlbumUpdateReq',
    component: () => import('../views/album/RequestUpdateAlbum.vue'),
  },
  {
    path: '/artist/update/:id',
    name: 'ArtistUpdate',
    component: () => import('../views/artist/ArtistUpdate.vue'),
  },
  {
    path: '/requests/artist/update/:id',
    name: 'ArtistUpdateReq',
    component: () => import('../views/artist/RequestUpdateArtist.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
