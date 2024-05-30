import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { z } from 'zod'
import { validates } from '@server/utils/validation'
import { Band } from './band'
import { Album } from './album'

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  name: string

  @Column('date', { nullable: true, default: null })
  birth: Date | null

  @ManyToMany(() => Band, (band) => band.artists, {
    onDelete: 'CASCADE',
  })
  bands: Band[]

  @ManyToMany(() => Album, (album) => album.artists)
  albums: Album[]
}

export type ArtistBare = Omit<Artist, 'bands' | 'albums'>

export const artistSchema = validates<ArtistBare>().with({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  birth: z.date().nullable(),
})

export const artistInsertBandSchema = artistSchema
  .omit({ id: true })
  .extend({ bandId: z.number().int().positive() })

export const artistInsertAlbumSchema = artistSchema.omit({ id: true }).extend({
  albumId: z.number().int().positive(),
  bandId: z.number().int().positive(),
})

export type ArtistBandInsert = z.infer<typeof artistInsertBandSchema>
export type ArtistAlbumInsert = z.infer<typeof artistInsertAlbumSchema>
