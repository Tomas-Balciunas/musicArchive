import { albumSchema } from '@server/entities/album'
import { publicProcedure } from '@server/trpc'
import { getAlbum } from '../services'

export default publicProcedure
  .input(albumSchema.shape.id)
  .query(async ({ input: id, ctx: { db } }) => {
    const album = getAlbum(id, db)

    return album
  })
