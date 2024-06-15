import { RequestBandUpdate, bandUpdateReqSchema } from '@server/entities/band/request_update'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(bandUpdateReqSchema)
  .mutation(async ({ input, ctx: { db, authUser } }) => {
    const { bandId, artists, ...data } = input
    const userId = authUser.id

    const artistsJson = JSON.stringify(artists)

    const storedReq = await db
      .getRepository(RequestBandUpdate)
      .save({ bandId, userId, artists: artistsJson, ...data })

    return storedReq
  })