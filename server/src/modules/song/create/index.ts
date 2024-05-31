import { Song, songInsertSchema } from '@server/entities/song'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(songInsertSchema)
  .mutation(async ({ input: song, ctx: { db } }) => {
    const createdSong = await db.getRepository(Song).save(song)

    return createdSong
  })
