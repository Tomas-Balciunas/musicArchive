import { AlbumFull, AlbumUpdate } from '@server/entities/album'
import { ArtistFull, ArtistInsert } from '@server/entities/artist'
import { BandFull, BandUpdate } from '@server/entities/band'
import { getAlbum } from '@server/modules/album/services'
import { getArtist } from '@server/modules/artist/services'
import { getBand } from '@server/modules/band/services'
import { EntityTypeUpdate } from '@server/shared/entities'
import { DataSource } from 'typeorm'

export function findChanges(
  data: BandUpdate | AlbumUpdate | ArtistInsert,
  og: any,
  list: string[]
) {
  const updated = Object.fromEntries(
    Object.entries(data).filter(([key]) => list.includes(key))
  )

  const original = Object.fromEntries(
    Object.entries(og).filter(([key]) => list.includes(key))
  )

  const comparison: { [key: string]: any } = {}
  const changes: { [key: string]: any } = {}

  Object.keys(updated).forEach((v) => {
    if (updated[v] !== original[v]) {
      comparison[v] = { old: original[v], new: updated[v] }
      changes[v] = updated[v]
    }
  })

  return {
    comparison: () => comparison,
    changes: () => changes,
  }
}

type EntityReturns = {
  [K in EntityTypeUpdate]: K extends 'BAND'
    ? BandFull
    : K extends 'ALBUM'
      ? AlbumFull
      : K extends 'ARTIST'
        ? ArtistFull
        : never
}

export async function entityGet(
  entity: EntityTypeUpdate,
  entityId: number,
  db: DataSource
): Promise<EntityReturns[typeof entity]> {
  const entityFetch: {
    [key in EntityTypeUpdate]: (
      id: number,
      db: DataSource
    ) => Promise<EntityReturns[key]>
  } = {
    BAND: getBand,
    ALBUM: getAlbum,
    ARTIST: getArtist,
  }

  const e = await entityFetch[entity](entityId, db)

  return e
}

export function areChanges(changes: object, relations: object) {
  const baseChanges = !Object.keys(changes).length

  const relationChanges = !Object.keys(relations).some(
    (k) => relations[k].length
  )

  return !baseChanges || !relationChanges
}
