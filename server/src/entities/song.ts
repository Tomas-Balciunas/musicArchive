import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
} from 'typeorm'
import { z } from 'zod'
import { validates } from '@server/utils/validation'
import { Album, albumSchema } from './album'

@Entity()
export class Song {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  title: string

  @Column('integer')
  duration: number

  @ManyToOne(() => Album, (album) => album.songs, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  album: Album
}

export type SongBare = Omit<Song, 'album'>
export type SongFull = Song

export const songSchema = validates<SongBare>().with({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  duration: z.number().int().positive(),
})

export const songInsertSchema = songSchema
  .omit({ id: true })
  .extend({ album: z.lazy(() => albumSchema) })

export type SongInsert = z.infer<typeof songInsertSchema>
