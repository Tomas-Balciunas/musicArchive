import {
  RequestCreate,
  entitiesOfCreateSchema,
} from '@server/entities/request/create'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(entitiesOfCreateSchema)
  .query(async ({ input: entity, ctx: { db } }) => {
    const foundRequests = await db
      .getRepository(RequestCreate)
      .find({
        where: { entity, status: 'pending' },
        select: { id: true, data: true, createdAt: true },
      })

    const parsedData = foundRequests.map((r) => {
      const parsed = JSON.parse(r.data)
      return { ...r, data: parsed }
    })

    return parsedData
  })
