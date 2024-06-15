import { validates } from '@server/utils/validation'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm'
import { z } from 'zod'
import { artistSchema } from '../artist'
import { BandClean } from './base'
import { Band } from '.'

@Entity()
export class RequestBandUpdate extends BandClean {
  @Column('jsonb')
  artists: string

  @Column('text')
  info: string

  @Column('integer')
  bandId: number

  @Column('integer')
  userId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  solvedAt: Date | null

  @Column('text', { default: 'pending' })
  status: string

  @ManyToOne(() => Band, (band) => band.updateReqs, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  band: Band
}

export const reqSchema = validates<Omit<RequestBandUpdate, 'band'>>().with({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  formed: z.number().int().min(1900).max(new Date().getFullYear()).nullable(),
  origin: z.string().min(1).max(200).nullable(),
  artists: z.string().min(1),
  info: z.string().min(1),
  bandId: z.number().int().positive(),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  solvedAt: z.date().nullable(),
  status: z.enum(['pending', 'approved', 'rejected']),
})

export const bandUpdateReqSchema = reqSchema
  .omit({
    id: true,
    userId: true,
    artists: true,
    createdAt: true,
    solvedAt: true,
    status: true,
  })
  .extend({
    artists: z.array(artistSchema.pick({ id: true, name: true })),
  })
