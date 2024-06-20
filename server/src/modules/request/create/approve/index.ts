import { AlbumBare } from '@server/entities/album'
import { ArtistBare } from '@server/entities/artist'
import {
  EntityTypeCreate,
  inputCreateSchema,
} from '@server/entities/request/create'
import { createAlbum } from '@server/modules/album/services'
import { createArtist } from '@server/modules/artist/services'
import { authProcedure } from '@server/trpc/procedures'
import { DataSource } from 'typeorm'

type EntityReturn = {
  ALBUM: AlbumBare
  ARTIST: ArtistBare
}

const entities: {
  [K in EntityTypeCreate]: (
    db: DataSource,
    data: any
  ) => Promise<EntityReturn[K]>
} = {
  ALBUM: createAlbum,
  ARTIST: createArtist,
}

export default authProcedure
  .input(inputCreateSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const { entity, ...data } = input

    const createdData = await entities[entity](db, data)

    return createdData
  })
