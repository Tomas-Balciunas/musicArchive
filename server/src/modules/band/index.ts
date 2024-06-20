import { router } from '@server/trpc'
import get from './get'
import find from './find'
import findPending from './findPending'
import create from './create'
import update from './update'
import status from './status'

export default router({
  get,
  find,
  findPending,
  create,
  update,
  status,
})
