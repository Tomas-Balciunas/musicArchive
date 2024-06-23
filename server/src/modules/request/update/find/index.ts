import {
  RequestUpdate,
  entityUpdateSchema,
} from '@server/entities/request/update'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(entityUpdateSchema)
  .query(async ({ input: entity, ctx: { db } }) => {
    const eLower = entity.toLowerCase()

    const foundRequests = await db
      .getRepository(RequestUpdate)
      .createQueryBuilder('request_update')
      .leftJoin(eLower, eLower, `${eLower}.id = request_update.entity_id`)
      .where('request_update.entity = :entity', { entity })
      .andWhere('request_Update.status = :pending', { pending: 'pending' })
      .select([
        'request_update.id as id',
        'request_update.created_at as created_at',
        eLower,
      ])
      .getRawMany()

    return foundRequests
  })
