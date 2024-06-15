import { RequestAlbumCreate } from '@server/entities'
import { reqSchema } from '@server/entities/band/request_update'
import { authProcedure } from '@server/trpc/procedures'
import { TRPCError } from '@trpc/server'

export default authProcedure
  .input(reqSchema.shape.id)
  .query(async ({ input: reqId, ctx: { db } }) => {
    const request = await db
      .getRepository(RequestAlbumCreate)
      .findOne({ where: { id: reqId }, relations: { band: true } })

    if (!request) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Create request or album not found.',
      })
    }

    const { artists, songs, band, ...requestClean } = request
    const artistsParsed = JSON.parse(artists)
    const songsParsed = JSON.parse(songs)

    return { band: {id: band.id, name: band.name}, ...requestClean, songs: songsParsed, artists: artistsParsed, info: request.info }
  })
