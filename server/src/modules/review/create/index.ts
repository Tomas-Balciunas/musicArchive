import { Review, reviewInsertSchema } from '@server/entities/review'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(reviewInsertSchema.omit({userId: true}))
  .mutation(async ({ input: reviewData, ctx: { authUser, db } }) => {
    const review = {
      ...reviewData,
      userId: authUser.id
    }

    const createdReview = await db.getRepository(Review).save(review)

    return createdReview
  })
