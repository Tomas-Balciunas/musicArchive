import { AlbumApproved } from '@server/entities/album'
import { ArtistBare } from '@server/entities/artist'
import { BandApproved } from '@server/entities/band'
import {
  EntityTypeUpdate,
  RequestUpdate,
  reqUpdateSchema,
} from '@server/entities/request/update'
import { updateAlbum } from '@server/modules/album/services'
import { updateArtist } from '@server/modules/artist/services'
import { updateBand } from '@server/modules/band/services'
import { authProcedure } from '@server/trpc/procedures'
import { TRPCError } from '@trpc/server'
import { DataSource } from 'typeorm'

type EntityReturn = {
  ALBUM: AlbumApproved
  ARTIST: ArtistBare
  BAND: BandApproved
}

const entities: {
  [K in EntityTypeUpdate]: (
    db: DataSource,
    data: any,
    id: number
  ) => Promise<EntityReturn[K]>
} = {
  ALBUM: updateAlbum,
  ARTIST: updateArtist,
  BAND: updateBand,
}

export default authProcedure
  .input(reqUpdateSchema.pick({ id: true, entity: true }))
  .mutation(async ({ input, ctx: { db } }) => {
    const { id, entity } = input
    const req = await db.getRepository(RequestUpdate).findOne({ where: { id } })

    if (!req) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Request not found.',
      })
    }

    const data = JSON.parse(req.data)

    const updatedData = await entities[entity](db, data, req.entityId)

    if (updatedData) {
      await db
        .getRepository(RequestUpdate)
        .update({ id }, { status: 'approved' })
    }

    return updatedData
  })
