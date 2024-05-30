import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinTable
  } from 'typeorm'
import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { User } from './user';
import { Album } from './album';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  body: string;

  @Column('integer')
  score: number;

  @Column('integer')
  albumId: number

  @Column('integer')
  userId: number

  @ManyToOne(() => User, {
    onDelete: 'CASCADE'
  })
  @JoinTable()
  user: User;

  @ManyToOne(() => Album, {
    onDelete: 'CASCADE'
  })
  @JoinTable()
  album: Album;
}

export type ReviewBare = Omit<Review, 'user' | 'album'>
export type ReviewFull = Review

export const reviewSchema = validates<ReviewBare>().with({
  id: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string().min(1), // change to a reasonable min value in deployment
  score: z.number().int().positive(),
  albumId: z.number().int().positive(),
  userId: z.number().int().positive()
})

export const reviewInsertSchema = reviewSchema.omit({id: true})
export type ReviewInsert = z.infer<typeof reviewInsertSchema>