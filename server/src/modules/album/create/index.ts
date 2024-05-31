import { Artist } from '@server/entities'
import { Album, albumInsertSchema } from '@server/entities/album'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { In } from 'typeorm'

export default authenticatedProcedure
  .input(albumInsertSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const { albumArtists, ...albumData } = input

    const artistRepo = db.getRepository(Artist)
    const albumRepo = db.getRepository(Album)

    const album = albumRepo.create(albumData)

    if (albumArtists.length) {
      album.artists = await artistRepo.find({
        where: { id: In(albumArtists) },
      })
    }

    const createdAlbum = await albumRepo.save(album)

    return createdAlbum
  })
