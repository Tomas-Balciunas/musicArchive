import { z } from 'zod'
import { Column, Entity } from 'typeorm'
import { validates } from '@server/utils/validation'
import { RequestBase, entities } from '../base'
import { bandUpdateSchema } from '@server/entities/band'
import { albumUpdateSchema } from '@server/entities/album'
import { artistUpdateSchema } from '@server/entities/artist'

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

const dataSchema = z.union([
  z.object({ entity: z.literal('ALBUM') }).merge(albumUpdateSchema),
  z.object({ entity: z.literal('ARTIST') }).merge(artistUpdateSchema),
  z.object({ entity: z.literal('BAND') }).merge(bandUpdateSchema),
])

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

export const approveUpdateSchema = reqUpdateSchema
  .pick({
    entity: true,
    entityId: true,
  })
  .and(dataSchema)

export const insertUpdateSchema = reqUpdateSchema
  .pick({
    entity: true,
    entityId: true,
    info: true,
  })
  .and(dataSchema)

export type EntityTypeUpdate = z.infer<typeof entityUpdateSchema>
export type InsertUpdate = z.infer<typeof insertUpdateSchema>
