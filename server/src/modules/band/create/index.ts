import { Band, bandInsertSchema } from '@server/entities/band'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(bandInsertSchema)
  .mutation(async ({ input: bandData, ctx: { db } }) => {
    const band = { ...bandData }

    const createdBand = await db.getRepository(Band).save(band)

    return createdBand
  })

