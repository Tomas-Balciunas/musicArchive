import { Band } from '@server/entities'
import { Artist, artistInsertSchema } from '@server/entities/artist'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
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
