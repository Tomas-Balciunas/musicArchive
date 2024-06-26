import { ALBUM_NOT_FOUND } from '@server/consts'
import { Song } from '@server/entities'
import {
  Album,
  type AlbumFull,
  type AlbumUpdate,
  type AlbumInsert,
  type AlbumApproved,
} from '@server/entities/album'
import { Artist } from '@server/entities/artist'
import { type SongInsert } from '@server/entities/song'
import { TRPCError } from '@trpc/server'
import { DataSource, In } from 'typeorm'

export async function createAlbum(
  db: DataSource,
  data: AlbumInsert
): Promise<AlbumApproved> {
  const { artists, songs, ...form } = data

  const artistRepo = db.getRepository(Artist)
  const albumRepo = db.getRepository(Album)
  const songRepo = db.getRepository(Song)

  const artistList = artists.map((a) => a.id)
  const album = albumRepo.create(form)
  const songsCreated = songRepo.create(songs)

  if (artistList.length) {
    album.artists = await artistRepo.find({
      where: { id: In(artistList) },
    })
  }

  if (songs.length) {
    album.songs = songsCreated
  }

  const createdAlbum = await albumRepo.save(album)

  return createdAlbum
}

export async function updateAlbum(
  db: DataSource,
  data: AlbumUpdate,
  id: number
): Promise<AlbumApproved> {
  const { artists, songs, ...base } = data

  const albumRepo = db.getRepository(Album)
  const artistRepo = db.getRepository(Artist)
  const songRepo = db.getRepository(Song)

  const queryRunner = db.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    if (Object.keys(base).length) {
      await albumRepo.update({ id }, base)
    }

    if (artists.length || songs.length) {
      const album = await getAlbum(id, db, ['artists'])

      if (artists.length) {
        const idList = data.artists.map((a) => a.id)

        const list = await artistRepo.find({
          where: { id: In(idList) },
        })

        list.forEach((a) => album.artists.push(a))
      }

      if (songs.length) {
        const withAlbum: SongInsert[] = songs.map((s) => ({ ...s, album }))

        withAlbum.forEach(async (s) => {
          await songRepo.save(s)
        })
      }

      await albumRepo.save(album)
    }

    await queryRunner.commitTransaction()
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    await queryRunner.release()
  }

  const updatedAlbum = await getAlbum(id, db, ['artists', 'songs'])

  return updatedAlbum
}

export async function albumExists(db: DataSource, data: AlbumInsert) {
  const album = await db
    .getRepository(Album)
    .findOne({ where: { bandId: data.bandId, title: data.title } })

  if (album) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Album "${data.title}" already belongs to this band.`,
    })
  }
}

export async function getAlbum(
  id: number,
  db: DataSource,
  relations: string[] = ['artists', 'band', 'reviews', 'songs']
): Promise<AlbumFull> {
  const album = (await db.getRepository(Album).findOne({
    where: { id },
    relations,
  })) as AlbumFull

  if (!album) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ALBUM_NOT_FOUND,
    })
  }

  return album
}
