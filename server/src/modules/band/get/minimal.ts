import { bandSchema } from '@server/entities/band'
import { publicProcedure } from '@server/trpc'
import { getBandMinimal } from '../services'

export default publicProcedure
  .input(bandSchema.shape.id)
  .query(async ({ input: id, ctx: { db } }) => {
    const band = getBandMinimal(id, db)

    return band
  })
