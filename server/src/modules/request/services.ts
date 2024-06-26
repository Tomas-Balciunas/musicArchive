import { type AlbumFull, type AlbumUpdate } from '@server/entities/album'
import { type ArtistFull, type ArtistInsert } from '@server/entities/artist'
import { type BandFull, type BandUpdate } from '@server/entities/band'
import { getAlbum } from '@server/modules/album/services'
import { getArtist } from '@server/modules/artist/services'
import { getBand } from '@server/modules/band/services'
import { type EntitiesOfUpdate } from '@server/shared/entities'
import { TRPCError } from '@trpc/server'
import {
  DataSource,
  type FindOneOptions,
  type ObjectLiteral,
  Repository,
} from 'typeorm'

type EntityWithId = { id: number }
type EntityReturns = {
  [K in EntitiesOfUpdate]: K extends 'BAND'
    ? BandFull
    : K extends 'ALBUM'
      ? AlbumFull
      : K extends 'ARTIST'
        ? ArtistFull
        : never
}

export async function getRequest<T extends ObjectLiteral & EntityWithId>(
  repo: Repository<T>,
  id: number
): Promise<T> {
  const r: T | null = await repo.findOne({ where: { id } } as FindOneOptions<T>)

  if (!r) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Request not found.',
    })
  }

  return r
}

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

export async function entityGet(
  entity: EntitiesOfUpdate,
  entityId: number,
  db: DataSource
): Promise<EntityReturns[typeof entity]> {
  const entityFetch: {
    [key in EntitiesOfUpdate]: (
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

export function areChanges(changes: object, relations: any) {
  const baseChanges = !Object.keys(changes).length

  const relationChanges = !Object.keys(relations).some(
    (k) => relations[k].length
  )

  return !baseChanges || !relationChanges
}

export function relationsSeparator(data: any) {
  const keys: string[] = []
  const relations: Record<string, any[]> = {}

  Object.entries(data).forEach(([k, v]: [string, unknown]) => {
    if (Array.isArray(v)) {
      if (v.every((item) => isObject(item))) {
        relations[k] = v
      } else {
        keys.push(k)
      }
    } else {
      keys.push(k)
    }
  })

  return { keys, relations }
}

function isObject(item: unknown) {
  return item !== null && !Array.isArray(item) && typeof item === 'object'
}
