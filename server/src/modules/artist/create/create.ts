import { Band } from '@server/entities'
import { Artist, artistInsertSchema } from '@server/entities/artist'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(artistInsertSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const { bandId, ...artist } = input

    const band = await db.getRepository(Band).findBy({ id: bandId })

    const createdArtist = await db.getRepository(Artist).save({
      ...artist,
      bands: band,
    })

    return createdArtist
  })
