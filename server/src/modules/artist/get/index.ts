import { Artist, artistSchema } from '@server/entities/artist'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .input(artistSchema.shape.id)
  .query(async ({ input: artistId, ctx: { db } }) => {
    const artist = await db.getRepository(Artist).findOne({
      relations: { bands: true, albums: true },
      where: { id: artistId },
    })

    if (!artist) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Artist was not found`,
      })
    }

    return artist
  })
