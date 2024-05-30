import { Review, reviewSchema } from '@server/entities/review'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .input(reviewSchema.shape.id)
  .query(async ({ input: reviewId, ctx: { db } }) => {
    const review = await db
      .getRepository(Review)
      .findOne({ where: { id: reviewId }, relations: { album: true } })

    if (!review) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Band was not found`,
      })
    }

    return review
  })
