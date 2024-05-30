import { Post, postInsertSchema } from '@server/entities/post'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .input(postInsertSchema)
  .mutation(async ({ input: postData, ctx: { db } }) => {
    const post = { ...postData }

    const createdPost = await db.getRepository(Post).save(post)

    return createdPost
  })

  // change to authenticated procedure later!!!