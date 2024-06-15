import { RequestAlbumCreate } from '@server/entities'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure.query(async ({ ctx: { db } }) => {
  const requests = await db.getRepository(RequestAlbumCreate).find({
    relations: { band: true },
    select: { id: true, title: true, createdAt: true, band: { name: true } },
    where: { status: 'pending' },
  })

  return requests
})
