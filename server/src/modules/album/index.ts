import { router } from '@server/trpc'
import get from './get'
import create from './create'
import reviewData from './get/reviewData'
import request from './request'

export default router({
  get,
  reviewData,
  create,
  request
})