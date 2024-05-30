import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm'
import { validates } from '@server/utils/validation'
import { z } from 'zod'
import { Band } from './band'
import { Song } from './song'
import { Review } from './review'
import { Artist } from './artist'

@Entity()
export class Album {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  title: string

  @Column('number')
  bandId: number

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

  @ManyToMany(() => Artist, {
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

export type AlbumBare = Omit<Album, 'band' | 'songs' | 'reviews' | 'artists'>
export type AlbumFull = Album

export const albumSchema = validates<AlbumBare>().with({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  bandId: z.number().int().positive(),
})

export const albumInsertSchema = albumSchema
  .omit({ id: true })
  .extend({ albumArtists: z.array(z.number().int().positive()) })

export type AlbumInsert = z.infer<typeof albumInsertSchema>