import { Album, albumSchema } from '@server/entities/album'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .input(albumSchema.shape.id)
  .query(async ({ input: albumId, ctx: { db } }) => {
    const album = await db.getRepository(Album).findOne({
      relations: { band: true },
      where: { id: albumId },
      select: {
        id: true,
        title: true,
        band: {
          id: true,
          name: true,
        },
      },
    })

    return album
  })
