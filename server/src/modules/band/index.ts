import { router } from '@server/trpc'
import get from './get'
import find from './find'
import findPending from './findPending'
import create from './create'
import update from './update'
import status from './status'
import request from './request'

export default router({
  get,
  find,
  findPending,
  create,
  update,
  status,
  request,
})
