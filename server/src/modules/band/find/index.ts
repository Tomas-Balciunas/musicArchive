import { Band, type BandBare } from '@server/entities/band'
import { publicProcedure } from '@server/trpc'

export default publicProcedure.query(async ({ ctx: { db } }) => {
  const bands = (await db
    .getRepository(Band)
    .find({
      where: { pending: false },
      order: { id: 'ASC' },
      select: { id: true, name: true, description: true },
    })) as BandBare[]

  return bands
})
