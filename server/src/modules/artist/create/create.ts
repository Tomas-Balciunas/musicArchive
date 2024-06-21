import { artistInsertSchema } from '@server/entities/artist'
import { authProcedure } from '@server/trpc/procedures'
import { createArtist } from '../services'

export default authProcedure
  .input(artistInsertSchema)
  .mutation(async ({ input: data, ctx: { db } }) => {
    const createdArtist = await createArtist(db, data)

    return createdArtist
  })
