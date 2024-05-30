import { Album, albumSchema, type AlbumFull } from '@server/entities/album'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .input(albumSchema.shape.id)
  .query(async ({ input: albumId, ctx: { db } }) => {
    const album = (await db.getRepository(Album).findOne({
      where: { id: albumId },
      relations: {
        songs: true,
        band: true,
        artists: true,
        reviews: true
      },
    })) as AlbumFull

    if (!album) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Album was not found`,
      })
    }

    return album
  })
