import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinTable,
} from 'typeorm'
import { validates } from '@server/utils/validation'
import { z } from 'zod'
import { Band } from './band'
import { User } from './user'

@Entity()
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  body: string

  @Column('integer')
  userId: number

  @Column('integer')
  bandId: number

  @ManyToOne(() => User, (user) => user.posts)
  user: User

  @ManyToOne(() => Band, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  band: Band

  @CreateDateColumn()
  createdAt: Date
}

export type PostBare = Omit<Post, 'user' | 'band'>
export type PostFull = Post

export const postSchema = validates<PostBare>().with({
  id: z.number().int().positive(),
  body: z.string().min(1),
  bandId: z.number().int().positive(),
  userId: z.number().int().positive(),
  createdAt: z.date(),
})

export const postInsertSchema = postSchema.omit({ id: true, createdAt: true })
export type PostInsert = z.infer<typeof postInsertSchema>
