import { z } from 'zod'
import {
  Entity,
} from 'typeorm'
import { validates } from '@server/utils/validation'
import { albumInsertSchema } from '@server/entities/album/index'
import { artistInsertSchema } from '@server/entities/artist'
import { RequestBase, entities } from '../base'

@Entity()
export class RequestCreate extends RequestBase {}

export const entityCreateSchema = z.union([entities.shape.album, entities.shape.artist])

export const reqSchema = validates<RequestCreate>().with({
  id: z.number().int().positive(),
  info: z.string().min(1),
  entity: entityCreateSchema,
  data: z.string().min(1),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  solvedAt: z.date().nullable(),
  status: z.enum(['pending', 'approved', 'rejected']),
})

const dataSchema = z.union([
  z.object({ entity: z.literal('ALBUM') }).merge(albumInsertSchema),
  z.object({ entity: z.literal('ARTIST') }).merge(artistInsertSchema),
])

export const inputCreateSchema = reqSchema
  .pick({
    id: true,
    entity: true,
  })
  .and(dataSchema)

export const insertCreateSchema = reqSchema
  .pick({
    entity: true,
    info: true,
  })
  .and(
    dataSchema,
  )

export type EntityTypeCreate = z.infer<typeof entityCreateSchema>
export type InsertCreate = z.infer<typeof insertCreateSchema>
