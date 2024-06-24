import { z } from 'zod'
import { Entity } from 'typeorm'
import { validates } from '@server/utils/validation'
import { type AlbumApproved, albumInsertSchema } from '@server/entities/album/index'
import { type ArtistBare, artistInsertSchema } from '@server/entities/artist'
import { RequestBase, entities } from '../base'

@Entity()
export class RequestCreate extends RequestBase {}

export const entitiesOfCreateSchema = z.union([
  entities.shape.album,
  entities.shape.artist,
])

export type CreateEntityReturns = {
  ALBUM: AlbumApproved
  ARTIST: ArtistBare
}

export const reqCreateSchema = validates<RequestCreate>().with({
  id: z.number().int().positive(),
  info: z.string().min(1),
  entity: entitiesOfCreateSchema,
  data: z.string().min(1),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  solvedAt: z.date().nullable(),
  status: z.enum(['pending', 'approved', 'rejected']),
})

export const insertCreateSchema = reqCreateSchema
  .pick({
    entity: true,
    info: true,
  })
  .and(
    z.union([
      z.object({ entity: z.literal('ALBUM') }).merge(albumInsertSchema),
      z.object({ entity: z.literal('ARTIST') }).merge(artistInsertSchema),
    ])
  )

export type EntitiesOfCreate = z.infer<typeof entitiesOfCreateSchema>
export type InsertCreate = z.infer<typeof insertCreateSchema>
