import { RequestCreate, reqCreateSchema } from '@server/entities/request/create'
import { authProcedure } from '@server/trpc/procedures'
import { getRequest } from '../../services'

export default authProcedure
  .input(reqCreateSchema.shape.id)
  .query(async ({ input: id, ctx: { db } }) => {
    const repo = db.getRepository(RequestCreate)
    const r = await getRequest<RequestCreate>(repo, id)

    const { data, ...base } = r

    const parsedData = JSON.parse(data)

    return { ...base, data: parsedData }
  })
