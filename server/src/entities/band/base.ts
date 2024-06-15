import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class BandClean {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  name: string

  @Column('text')
  description: string

  @Column('integer', { nullable: true, default: null })
  formed: number | null

  @Column('text', { nullable: true, default: null })
  origin: string | null
}
