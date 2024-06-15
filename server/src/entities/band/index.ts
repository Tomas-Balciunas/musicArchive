import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
} from 'typeorm'
import { validates } from '@server/utils/validation'
import { z } from 'zod'
import { Artist, artistSchema } from '../artist'
import { Album } from '../album'
import { Post } from '../post'
import { BandClean } from './base'
import { RequestBandUpdate } from './request_update'

@Entity()
export class Band extends BandClean {
  @Column('bool', { default: true })
  pending: boolean

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => Post, (posts) => posts.band)
  @JoinTable()
  posts: Post[]

  @ManyToMany(() => Artist, (artist) => artist.bands, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'band_artists',
    joinColumn: {
      name: 'band_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'artist_id',
      referencedColumnName: 'id',
    },
  })
  artists: Artist[]

  @OneToMany(() => Album, (albums) => albums.band, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  albums: Album[]

  @OneToMany(() => RequestBandUpdate, (updateReqs) => updateReqs.band, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  updateReqs: RequestBandUpdate[]
}

export type BandBare = BandClean
export type BandFull = Band

export const bandSchema = validates<BandBare>().with({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  formed: z.number().int().min(1900).max(new Date().getFullYear()).nullable(),
  origin: z.string().min(1).max(200).nullable(),
})

export const bandInsertSchema = bandSchema.omit({ id: true })
export const bandIdSchema = bandSchema.pick({ id: true })
export const bandUpdateSchema = bandSchema.omit({ id: true }).extend({
  artists: z.array(artistSchema.pick({ id: true, name: true })),
})

export type BandUpdate = z.infer<typeof bandUpdateSchema>
export type BandInsert = z.infer<typeof bandInsertSchema>
