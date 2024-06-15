import { Song, songInsertSchema } from '@server/entities/song'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure
  .input(songInsertSchema)
  .mutation(async ({ input: song, ctx: { db } }) => {
    const createdSong = await db.getRepository(Song).save(song)

    return createdSong
  })
