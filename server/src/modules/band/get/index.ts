import { bandSchema } from '@server/entities/band'
import { publicProcedure } from '@server/trpc'
import { getBand } from '../services'

export default publicProcedure
  .input(bandSchema.shape.id)
  .query(async ({ input: id, ctx: { db } }) => {
    const band = getBand(id, db)

    return band
  })
