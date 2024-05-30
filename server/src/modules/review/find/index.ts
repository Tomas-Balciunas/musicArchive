import { Review, type ReviewBare } from '@server/entities/review'
import { publicProcedure } from '@server/trpc'

export default publicProcedure.query(
  async ({ ctx: { db } }) => {
    const reviews = (await db.getRepository(Review).find({
      order: { id: 'ASC' },
    })) as ReviewBare[]

    return reviews
  }
)