import {
  RequestUpdate,
  insertUpdateSchema,
} from '@server/entities/request/update'
import { authProcedure } from '@server/trpc/procedures'
import { areChanges, entityGet, findChanges } from '../services'
import { TRPCError } from '@trpc/server'

export default authProcedure
  .input(insertUpdateSchema)
  .mutation(async ({ input, ctx: { db, authUser } }) => {
    const { entity, entityId, info, ...data } = input
    const userId = authUser.id

    const relations: object[] = []
    const keys: string[] = []

    Object.entries(data).forEach(([k, v]) => {
      Array.isArray(v) ? (relations[k] = v) : keys.push(k)
    })

    const original = await entityGet(entity, entityId, db)

    const changes = findChanges(data, original, keys).changes()

    if (!areChanges(changes, relations)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No changes detected.',
      })
    }

    const changesJson = JSON.stringify({...changes, ...relations})

    const req = await db
      .getRepository(RequestUpdate)
      .save({ entity, entityId, userId, data: changesJson, info })

    return req
  })
