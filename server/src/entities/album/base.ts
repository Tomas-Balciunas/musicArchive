import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class AlbumClean {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  title: string

  @Column('integer', { nullable: true, default: null })
  released: number | null

  @Column('integer')
  bandId: number
}
