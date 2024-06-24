import { ARTIST_NOT_FOUND } from '@server/consts'
import { Artist } from '@server/entities'
import {
  type ArtistBare,
  type ArtistFull,
  type ArtistInsert,
  type ArtistUpdate,
} from '@server/entities/artist'
import { TRPCError } from '@trpc/server'
import { DataSource } from 'typeorm'

export async function updateArtist(
  db: DataSource,
  data: ArtistUpdate,
  id: number
): Promise<ArtistBare> {
  await db.getRepository(Artist).update({ id }, data)

  const updatedArtist = await getArtist(id, db)

  return updatedArtist
}

export async function createArtist(
  db: DataSource,
  data: ArtistInsert
): Promise<ArtistBare> {
  const createdArtist = await db.getRepository(Artist).save(data)

  return createdArtist
}

export async function getArtist(
  id: number,
  db: DataSource
): Promise<ArtistFull> {
  const artist = (await db.getRepository(Artist).findOne({
    where: { id },
  })) as ArtistFull

  if (!artist) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ARTIST_NOT_FOUND,
    })
  }

  return artist
}
