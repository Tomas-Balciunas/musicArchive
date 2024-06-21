import { artistSchema, artistUpdateSchema } from '@server/entities/artist'
import { authProcedure } from '@server/trpc/procedures'
import { updateArtist } from '../services'

export default authProcedure
  .input(
    artistUpdateSchema.extend({
      id: artistSchema.shape.id,
    })
  )
  .mutation(async ({ input, ctx: { db } }) => {
    const { id, ...data } = input

    const updatedArtist = updateArtist(db, data, id)

    return updatedArtist
  })
