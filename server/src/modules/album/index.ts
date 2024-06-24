import { router } from '@server/trpc'
import get from './get'
import create from './create'
import reviewData from './get/minimal'

export default router({
  get,
  reviewData,
  create,
})