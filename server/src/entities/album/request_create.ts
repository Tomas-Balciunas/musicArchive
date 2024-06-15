import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm'
import { z } from 'zod'
import { validates } from '@server/utils/validation'
import { songSchema } from '../song'
import { Band } from '../band'
import { AlbumClean } from './base'

@Entity()
export class RequestAlbumCreate extends AlbumClean {
  @Column('jsonb')
  artists: string

  @Column('jsonb')
  songs: string

  @Column('text')
  info: string

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

export const reqSchema = validates<Omit<RequestAlbumCreate, 'band'>>().with({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  released: z.number().int().min(1900).max(new Date().getFullYear()).nullable(),
  bandId: z.number().int().positive(),
  artists: z.string().min(1),
  songs: z.string().min(1),
  info: z.string().min(1),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  solvedAt: z.date().nullable(),
  status: z.enum(['pending', 'approved', 'rejected']),
})

export const albumCreateReqSchema = reqSchema
  .omit({
    id: true,
    userId: true,
    artists: true,
    songs: true,
    createdAt: true,
    solvedAt: true,
    status: true,
  })
  .extend({
    songs: z.array(songSchema.pick({ title: true, duration: true })),
  })
