import { router } from '@server/trpc'
import create from './create/create'
import search from './search'
import add from './add'
import get from './get'
import update from './update'

export default router({
  create,
  search,
  add,
  get,
  update
})