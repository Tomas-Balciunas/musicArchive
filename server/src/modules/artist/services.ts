import { Artist, Band } from '@server/entities'
import { Album } from '@server/entities/album'
import {
  ArtistBare,
  ArtistFull,
  ArtistInsert,
  ArtistUpdate,
} from '@server/entities/artist'
import { TRPCError } from '@trpc/server'
import { DataSource, Repository } from 'typeorm'

export async function updateArtist(
  db: DataSource,
  data: ArtistUpdate,
  id: number
): Promise<ArtistBare> {
  await db.getRepository(Artist).update({ id }, data)

  const updatedArtist = await db
    .getRepository(Artist)
    .findOne({ where: { id } })

  if (!updatedArtist) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Updated artist not found.'
    })
  }

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

  return artist
}
