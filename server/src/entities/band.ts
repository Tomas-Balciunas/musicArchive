import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm'
import { validates } from '@server/utils/validation';
import { z } from 'zod';
import { Artist } from './artist';
import { Album } from './album';
import { Post } from './post';

@Entity()
export class Band {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @OneToMany(() => Post, (posts) => posts.band)
  @JoinTable()
  posts: Post[];

  @ManyToMany(() => Artist, artist => artist.bands, {
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
  artists: Artist[];

  @OneToMany(() => Album, albums => albums.band, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  albums: Album[];
}

export type BandBare = Omit<Band, 'artists' | 'albums' | 'posts'>
export type BandFull = Band

export const bandSchema = validates<BandBare>().with({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(500)
})

export const bandInsertSchema = bandSchema.omit({ id: true })
export const bandIdSchema = bandSchema.pick({id: true})

export type BandInsert = z.infer<typeof bandInsertSchema>