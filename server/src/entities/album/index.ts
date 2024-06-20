import {
  Entity,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm'
import { validates } from '@server/utils/validation'
import { z } from 'zod'
import { Band } from '../band'
import { Song, songSchema } from '../song'
import { Review } from '../review'
import { Artist, artistSchema } from '../artist'
import { AlbumClean } from './base'

@Entity()
export class Album extends AlbumClean {
  @ManyToOne(() => Band, (band) => band.albums, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  band: Band

  @OneToMany(() => Song, (songs) => songs.album, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  songs: Song[]

  @OneToMany(() => Review, (review) => review.album)
  @JoinTable()
  reviews: Review[]

  @ManyToMany(() => Artist, (artists) => artists.albums, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'album_artists',
    joinColumn: {
      name: 'album_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'artist_id',
      referencedColumnName: 'id',
    },
  })
  artists: Artist[]
}

export type AlbumBare = AlbumClean
export type AlbumFull = Album

export const albumSchema = validates<AlbumBare>().with({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  released: z.number().int().min(1900).max(new Date().getFullYear()).nullable(),
  bandId: z.number().int().positive(),
})

export const albumInsertSchema = albumSchema.omit({ id: true }).extend({
  artists: z.array(
    z.lazy(() => artistSchema.pick({ id: true, name: true }))
  ),
  songs: z.array(
    z.lazy(() => songSchema.pick({ title: true, duration: true }))
  ),
})

export const albumUpdateSchema = albumSchema
  .omit({ id: true, bandId: true })
  .extend({
    artists: z.array(
      z.lazy(() => artistSchema.pick({ id: true, name: true }))
    ),
    songs: z.array(
      z.lazy(() => songSchema.pick({ title: true, duration: true }))
    ),
  })

export type AlbumInsert = z.infer<typeof albumInsertSchema>
export type AlbumUpdate = z.infer<typeof albumUpdateSchema>
