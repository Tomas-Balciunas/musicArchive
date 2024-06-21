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

export function getRepo(
  db: DataSource,
  albumId: number | undefined,
  bandId: number | undefined
): [number, Repository<Album> | Repository<Band>] {
  if (albumId) {
    const repo = db.getRepository(Album)

    return [albumId, repo]
  }

  if (bandId) {
    const repo = db.getRepository(Band)

    return [bandId, repo]
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Unable to retrieve artists',
  })
}

export async function addArtist(
  db: DataSource,
  entityId: number,
  artistId: number,
  repo: Repository<Album | Band>
) {
  const artist = await db
    .getRepository(Artist)
    .findOne({ where: { id: artistId } })

  const entity = await repo.findOne({
    relations: { artists: true },
    where: { id: entityId },
  })

  if (artist && entity) {
    entity.artists.push(artist)
  } else {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Album/band or artist not found`,
    })
  }

  const addedArtist = await (repo as Repository<typeof entity>).save(entity)

  return addedArtist
}

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

export async function artistChanges() {}

export async function getArtist(
  id: number,
  db: DataSource
): Promise<ArtistFull> {
  const artist = (await db.getRepository(Artist).findOne({
    where: { id },
  })) as ArtistFull

  return artist
}
