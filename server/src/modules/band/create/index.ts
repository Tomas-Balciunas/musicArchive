import { Band, bandInsertSchema } from '@server/entities/band'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .input(bandInsertSchema)
  .mutation(async ({ input: bandData, ctx: { db } }) => {
    const band = { ...bandData }

    const createdBand = await db.getRepository(Band).save(band)

    return createdBand
  })

// change to authenticated procedure later!!!
