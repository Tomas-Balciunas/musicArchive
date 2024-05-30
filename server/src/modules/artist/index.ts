import { router } from '@server/trpc'
import createForBand from './create/artistBand'
import createForAlbum from './create/artistAlbum'

export default router({
  createForBand,
  createForAlbum
})