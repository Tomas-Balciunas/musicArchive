import { ALBUM_NOT_FOUND } from '@server/consts'
import { Album, albumSchema, type AlbumFull } from '@server/entities/album'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'
import { getAlbum } from '../services'

export default publicProcedure
  .input(albumSchema.shape.id)
  .query(async ({ input: id, ctx: { db } }) => {
    const album = getAlbum(id, db)

    return album
  })
