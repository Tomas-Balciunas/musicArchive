import { Review, reviewInsertSchema } from '@server/entities/review'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .input(reviewInsertSchema)
  .mutation(async ({ input: review, ctx: { db } }) => {
    const createdReview = await db.getRepository(Review).save(review)

    return createdReview
  })
