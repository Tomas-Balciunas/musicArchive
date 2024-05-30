import { Album } from '@server/entities'
import { Artist, artistInsertAlbumSchema } from '@server/entities/artist'
import { publicProcedure } from '@server/trpc'

export default publicProcedure
  .input(artistInsertAlbumSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const { albumId, ...artist } = input

    const album = await db.getRepository(Album).findBy({ id: albumId })

    const createdArtist = await db.getRepository(Artist).save({
      ...artist,
      albums: album
    })

    return createdArtist
  })

// change to authenticated procedure later!!!
