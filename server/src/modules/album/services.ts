import { Album, type AlbumInsert } from '@server/entities/album'
import { Artist } from '@server/entities/artist'
import { DataSource, In } from 'typeorm'

export async function createAlbum(
  db: DataSource,
  data: AlbumInsert
): Promise<Album> {
  const { artistList, ...form } = data

  const artistRepo = db.getRepository(Artist)
  const albumRepo = db.getRepository(Album)

  const album = albumRepo.create(form)

  if (artistList.length) {
    album.artists = await artistRepo.find({
      where: { id: In(artistList) },
    })
  }

  const createdAlbum = await albumRepo.save(album)

  return createdAlbum
}

export async function albumExists(db: DataSource, data: AlbumInsert) {
  const album = await db
    .getRepository(Album)
    .exists({ where: { bandId: data.bandId, title: data.title } })

  return album
}
