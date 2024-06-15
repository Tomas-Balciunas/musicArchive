import { Review, reviewInsertSchema } from '@server/entities/review'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(reviewInsertSchema.omit({ userId: true }))
  .mutation(async ({ input: reviewData, ctx: { authUser, db } }) => {
    const review = {
      ...reviewData,
      userId: authUser.id,
    }

    const createdReview = await db.getRepository(Review).save(review)

    return createdReview
  })
