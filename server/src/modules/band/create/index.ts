import { Band, bandInsertSchema } from '@server/entities/band'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(bandInsertSchema)
  .mutation(async ({ input: bandData, ctx: { db } }) => {
    const band = { ...bandData }

    const createdBand = await db.getRepository(Band).save(band)

    return createdBand
  })
