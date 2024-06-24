import {
  type EntitiesOfCreate,
  RequestCreate,
  type CreateEntityReturns,
  reqCreateSchema,
} from '@server/entities/request/create'
import { createAlbum } from '@server/modules/album/services'
import { createArtist } from '@server/modules/artist/services'
import { authProcedure } from '@server/trpc/procedures'
import { DataSource } from 'typeorm'
import { getRequest } from '../../services'

const entities: {
  [K in EntitiesOfCreate]: (
    db: DataSource,
    data: any
  ) => Promise<CreateEntityReturns[K]>
} = {
  ALBUM: createAlbum,
  ARTIST: createArtist,
}

export default authProcedure
  .input(reqCreateSchema.pick({ id: true, entity: true }))
  .mutation(async ({ input, ctx: { db } }) => {
    const { id, entity } = input
    const repo = db.getRepository(RequestCreate)
    const request = await getRequest<RequestCreate>(repo, id)

    const data = JSON.parse(request.data)

    const createdData = await entities[entity](db, data)

    if (createdData) {
      await db
        .getRepository(RequestCreate)
        .update({ id }, { status: 'approved' })
    }

    return createdData
  })
