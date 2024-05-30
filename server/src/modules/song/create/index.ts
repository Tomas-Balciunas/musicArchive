import { Song, songInsertSchema } from '@server/entities/song'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .input(songInsertSchema)
  .mutation(async ({ input: song, ctx: { db } }) => {
    const createdSong = await db.getRepository(Song).save(song)

    return createdSong
  })

  // change to authenticated procedure later!!!