import { RequestCreate, reqSchema } from '@server/entities/request/create'
import { authProcedure } from '@server/trpc/procedures'
import { TRPCError } from '@trpc/server'

export default authProcedure
  .input(reqSchema.shape.id)
  .query(async ({ input: rId, ctx: { db } }) => {
    const req = await db.getRepository(RequestCreate).findOne({where: {id: rId}})

    if (!req) {
        throw new TRPCError({
            code:'NOT_FOUND',
            message: 'Request not found.'
        })
    }

    const { data, ...base } = req

    const parsedData = JSON.parse(data)

    return {...base, data: parsedData}
  })
