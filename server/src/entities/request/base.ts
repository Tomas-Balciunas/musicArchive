import { z } from 'zod'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class RequestBase {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  entity: string

  @Column('jsonb')
  data: string

  @Column('text')
  info: string

  @Column('integer')
  userId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  solvedAt: Date | null

  @Column('text', { default: 'pending' })
  status: 'pending' | 'approved' | 'rejected'
}

export const entities = z.object({
  album: z.literal('ALBUM'),
  artist: z.literal('ARTIST'),
  band: z.literal('BAND')
})
