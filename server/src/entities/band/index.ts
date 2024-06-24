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
}

export type BandBare = BandClean
export type BandMinimal = Pick<BandClean, 'id' | 'name'>
export type BandFull = Band
export type BandApproved = Omit<BandFull, 'albums' | 'posts'>

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
  artists: z.array(z.lazy(() => artistSchema.pick({ id: true, name: true }))),
})

export type BandUpdate = z.infer<typeof bandUpdateSchema>
export type BandInsert = z.infer<typeof bandInsertSchema>
