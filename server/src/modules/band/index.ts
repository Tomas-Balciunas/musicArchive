import { router } from '@server/trpc'
import get from './get'
import find from './find'
import findPending from './find/pending'
import create from './create'
import update from './update'
import status from './status'
import getMinimal from './get/minimal'

export default router({
  get,
  getMinimal,
  find,
  findPending,
  create,
  update,
  status,
})
