import { router } from '@server/trpc'
import get from './get'
import find from './find'
import create from './create'

export default router({
  get,
  find,
  create
})