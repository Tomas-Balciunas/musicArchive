import { Band } from '@server/entities'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure.query(async ({ ctx: { db } }) => {
  const pendingBands = await db
    .getRepository(Band)
    .find({ where: { pending: true }, select: { id: true, name: true, createdAt: true } })

  return pendingBands
})
