import { RequestCreate, reqCreateSchema } from '@server/entities/request/create'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(reqCreateSchema.shape.id)
  .mutation(async ({ input: rId, ctx: { db } }) => {
    const rejectedRequest = await db
      .getRepository(RequestCreate)
      .update({ id: rId }, { status: 'rejected' })

    return rejectedRequest
  })
