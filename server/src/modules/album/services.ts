import { Song } from '@server/entities'
import {
  Album,
  AlbumBare,
  AlbumFull,
  AlbumUpdate,
  type AlbumInsert,
} from '@server/entities/album'
import { Artist } from '@server/entities/artist'
import { SongFull, SongInsert } from '@server/entities/song'
import { TRPCError } from '@trpc/server'
import { DataSource, In } from 'typeorm'

export async function createAlbum(
  db: DataSource,
  data: AlbumInsert
): Promise<AlbumBare> {
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
): Promise<AlbumBare> {
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
      const album = await albumRepo.findOne({
        where: { id },
        relations: ['artists', 'songs'],
      })

      if (!album) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Album not found.',
        })
      }

      if (artists.length) {
        const idList = data.artists.map((a) => a.id)

        const list = await artistRepo.find({
          where: { id: In(idList) },
        })

        list.forEach((a) => album.artists.push(a))
      }

      if (songs.length) {
        const withAlbumID: SongInsert[] = songs.map((s) => ({ ...s, album }))

        withAlbumID.forEach(async (s) => {
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

  const updatedAlbum = await albumRepo.findOne({
    where: { id },
    relations: ['artists', 'songs'],
  })

  if (!updatedAlbum) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Album not found.',
    })
  }

  return updatedAlbum
}

export async function albumExists(db: DataSource, data: AlbumInsert) {
  const album = await db
    .getRepository(Album)
    .exists({ where: { bandId: data.bandId, title: data.title } })

  return album
}

export async function getAlbum(id: number, db: DataSource): Promise<AlbumFull> {
  const album = (await db.getRepository(Album).findOne({
    where: { id },
  })) as AlbumFull

  return album
}
