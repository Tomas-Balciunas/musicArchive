import { Post, postInsertSchema } from '@server/entities/post'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(postInsertSchema.omit({ userId: true }))
  .mutation(async ({ input: postData, ctx: { authUser, db } }) => {
    const post = { ...postData, userId: authUser.id }

    const createdPost = await db.getRepository(Post).save(post)

    return createdPost
  })
