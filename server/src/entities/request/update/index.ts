import { z } from 'zod'
import { Column, Entity } from 'typeorm'
import { validates } from '@server/utils/validation'
import { type BandApproved, bandUpdateSchema } from '@server/entities/band'
import { type AlbumApproved, albumUpdateSchema } from '@server/entities/album'
import { type ArtistBare, artistUpdateSchema } from '@server/entities/artist'
import { RequestBase, entities } from '../base'

@Entity()
export class RequestUpdate extends RequestBase {
  @Column('integer')
  entityId: number
}

export const entityUpdateSchema = z.union([
  entities.shape.album,
  entities.shape.artist,
  entities.shape.band,
])

export type UpdateEntityReturns = {
  ALBUM: AlbumApproved
  ARTIST: ArtistBare
  BAND: BandApproved
}

export const reqUpdateSchema = validates<RequestUpdate>().with({
  id: z.number().int().positive(),
  info: z.string().min(1),
  entity: entityUpdateSchema,
  entityId: z.number().int().positive(),
  data: z.string().min(1),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  solvedAt: z.date().nullable(),
  status: z.enum(['pending', 'approved', 'rejected']),
})

export const insertUpdateSchema = reqUpdateSchema
  .pick({
    entity: true,
    entityId: true,
    info: true,
  })
  .and(
    z.union([
      z.object({ entity: z.literal('ALBUM') }).merge(albumUpdateSchema),
      z.object({ entity: z.literal('ARTIST') }).merge(artistUpdateSchema),
      z.object({ entity: z.literal('BAND') }).merge(bandUpdateSchema),
    ])
  )

export type EntitiesOfUpdate = z.infer<typeof entityUpdateSchema>
export type InsertUpdate = z.infer<typeof insertUpdateSchema>
