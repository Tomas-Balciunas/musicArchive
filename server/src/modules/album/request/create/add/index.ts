import {
  RequestAlbumCreate,
  albumCreateReqSchema,
} from '@server/entities/album/request_create'
import { artistSchema } from '@server/entities/artist'
import { authProcedure } from '@server/trpc/procedures'
import { z } from 'zod'

export default authProcedure
  .input(
    albumCreateReqSchema.extend({
      artists: z.array(artistSchema.pick({ id: true, name: true })),
    })
  )
  .mutation(async ({ input, ctx: { db, authUser } }) => {
    const { artists, songs, ...data } = input
    const userId = authUser.id

    const artistsJson = JSON.stringify(artists)
    const songsJson = JSON.stringify(songs)

    const storedReq = await db
      .getRepository(RequestAlbumCreate)
      .save({ userId, artists: artistsJson, songs: songsJson, ...data })

    return storedReq
  })
