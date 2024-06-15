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
import { Song } from '../song'
import { Review } from '../review'
import { Artist } from '../artist'
import { RequestAlbumCreate } from './request_create'
import { AlbumClean } from './base'

@Entity()
export class Album extends AlbumClean {
  @ManyToOne(() => Band, (band) => band.albums, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  band: Band

  @OneToMany(() => Song, (songs) => songs.album)
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

  @OneToMany(() => RequestAlbumCreate, (createReqs) => createReqs.band)
  @JoinTable()
  createReqs: RequestAlbumCreate[]
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
    z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(200),
    })
  ),
  songs: z.array(
    z.object({
      title: z.string().min(1).max(200),
      duration: z.number().int().positive(),
    })
  ),
})

export type AlbumInsert = z.infer<typeof albumInsertSchema>
