import { Band, type BandFull } from '@server/entities/band'
import { publicProcedure } from '@server/trpc'

export default publicProcedure.query(
  async ({ ctx: { db } }) => {
    const bands = (await db.getRepository(Band).find({
      order: { id: 'ASC' },
    })) as BandFull[]

    return bands
  }
)