import { router } from '../trpc'
import band from './band'
import album from './album'
import song from './song'
import user from './user'
import artist from './artist'
import review from './review'
import post from './post'
import request from './request'

export const appRouter = router({
  band,
  album,
  song,
  user,
  artist,
  review,
  post,
  request
})

export type AppRouter = typeof appRouter
