import { router } from '@server/trpc'
import find from './find'
import get from './get'
import status from './status'
import create from './create'

export default router({
  create,
  find,
  get,
  status,
})
