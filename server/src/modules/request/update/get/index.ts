import {
  RequestUpdate,
  entityUpdateSchema,
  reqUpdateSchema,
} from '@server/entities/request/update'
import { authProcedure } from '@server/trpc/procedures'
import { entityGet, findChanges, getRequest, relationsSeparator } from '../../services'

export default authProcedure
  .input(reqUpdateSchema.shape.id)
  .query(async ({ input: id, ctx: { db } }) => {
    const repo = db.getRepository(RequestUpdate)
    const req = await getRequest<RequestUpdate>(repo, id)

    const { data, ...base } = req
    const parsedData = JSON.parse(data)
    const { keys, relations } = relationsSeparator(parsedData)

    const og = await entityGet(
      entityUpdateSchema.parse(base.entity),
      base.entityId,
      db
    )

    const comparison = findChanges(parsedData, og, keys).comparison()

    return { ...base, comparison, ...relations }
  })
