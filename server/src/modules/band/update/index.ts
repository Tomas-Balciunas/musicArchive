import { Artist } from '@server/entities/artist'
import { Band, bandIdSchema, bandUpdateSchema } from '@server/entities/band'
import { authProcedure } from '@server/trpc/procedures'
import { In } from 'typeorm'
import { updateBand } from '../services'

export default authProcedure
  .input(
    bandUpdateSchema.extend({
      bandId: bandIdSchema.shape.id,
    })
  )
  .mutation(async ({ input, ctx: { db } }) => {
    const { bandId, ...data } = input
    const updatedBand = updateBand(db, data, bandId)

    return updatedBand
  })
