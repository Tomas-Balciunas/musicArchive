import {
  RequestCreate,
  entityCreateSchema,
} from '@server/entities/request/create'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(entityCreateSchema)
  .query(async ({ input: entity, ctx: { db } }) => {
    const foundRequests = await db
      .getRepository(RequestCreate)
      .find({ where: { entity, status: 'pending' } })

    foundRequests.map((r) => {
      // eslint-disable-next-line no-param-reassign
      r.data = JSON.parse(r.data)
      return r
    })

    return foundRequests
  })
