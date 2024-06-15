import { RequestBandUpdate } from '@server/entities'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure.query(async ({ ctx: { db } }) => {
  const requests = await db.getRepository(RequestBandUpdate).find({
    relations: { band: true },
    select: { id: true, createdAt: true, band: { name: true } },
    where: { status: 'pending' },
  })

  return requests
})
