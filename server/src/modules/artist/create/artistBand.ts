import { Band } from '@server/entities'
import { Artist, artistInsertBandSchema } from '@server/entities/artist'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .input(artistInsertBandSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const { bandId, ...artist } = input

    const band = await db.getRepository(Band).findBy({ id: bandId })

    const createdArtist = await db.getRepository(Artist).save({
      ...artist,
      bands: band
    })

    return createdArtist
  })

// change to authenticated procedure later!!!
