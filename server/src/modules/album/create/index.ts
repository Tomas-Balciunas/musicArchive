import { albumInsertSchema } from '@server/entities/album'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { albumExists, createAlbum } from '../services'

export default authenticatedProcedure
  .input(albumInsertSchema)
  .mutation(async ({ input: albumData, ctx: { db } }) => {
    const exists = await albumExists(db, albumData)

    if (exists) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Album "${albumData.title}" already belongs to this band.`,
      })
    }

    const result = await createAlbum(db, albumData)

    return result
  })
