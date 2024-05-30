import { Post } from '@server/entities'
import { PostBare } from '@server/entities/post'
import { publicProcedure } from '@server/trpc'

export default publicProcedure.query(async ({ ctx: { db } }) => {
  const posts = (await db
    .getRepository(Post)
    .find({ order: { createdAt: 'ASC' } })) as PostBare[]

  return posts
})
