import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { validates } from '@server/utils/validation'
import { Post } from './post'
import { Review } from './review'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  username: string

  @Column('text')
  email: string

  @Column('text')
  password: string

  @Column('integer', {default: 1})
  role: number

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post[]

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]
}

export type UserBare = Omit<User, 'posts' | 'reviews'>

export const userSchema = validates<UserBare>().with({
  id: z.number().int().positive(),
  username: z.string().min(4).max(20),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(64),
  role: z.number().int().positive(),
})

export const userInsertSchema = userSchema.omit({ id: true })

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<User, 'id'>

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
})
