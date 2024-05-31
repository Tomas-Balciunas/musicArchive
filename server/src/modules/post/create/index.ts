import { Post, postInsertSchema } from '@server/entities/post'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(postInsertSchema.omit({userId: true}))
  .mutation(async ({ input: postData, ctx: { authUser, db } }) => {
    const post = { ...postData, userId: authUser.id }

    const createdPost = await db.getRepository(Post).save(post)

    return createdPost
  })
