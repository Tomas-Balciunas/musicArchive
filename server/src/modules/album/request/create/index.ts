import { router } from '@server/trpc'
import find from './find'
import get from './get'
import status from './status'
import add from './add'

export default router({
  add,
  find,
  get,
  status,
})
