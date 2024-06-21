import {
  RequestUpdate,
  entityUpdateSchema,
  reqUpdateSchema,
} from '@server/entities/request/update'
import { authProcedure } from '@server/trpc/procedures'
import { TRPCError } from '@trpc/server'
import { entityGet, findChanges, relationsSeparator } from '../services'

export default authProcedure
  .input(reqUpdateSchema.shape.id)
  .query(async ({ input: rId, ctx: { db } }) => {
    const req = await db
      .getRepository(RequestUpdate)
      .findOne({ where: { id: rId } })

    if (!req) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Request not found.',
      })
    }

    const { data, ...base } = req
    const parsedData = JSON.parse(data)
    const {keys, relations} = relationsSeparator(parsedData)

    const og = await entityGet(
      entityUpdateSchema.parse(base.entity),
      base.entityId,
      db
    )

    const comparison = findChanges(parsedData, og, keys).comparison()

    return { ...base, comparison, ...relations }
  })
