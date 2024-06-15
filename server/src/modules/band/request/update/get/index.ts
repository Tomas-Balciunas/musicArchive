import { RequestBandUpdate } from '@server/entities'
import { BandUpdate } from '@server/entities/band'
import { reqSchema } from '@server/entities/band/request_update'
import { authProcedure } from '@server/trpc/procedures'
import { TRPCError } from '@trpc/server'

export default authProcedure
  .input(reqSchema.shape.id)
  .query(async ({ input: reqId, ctx: { db } }) => {
    const list = ['name', 'description', 'formed', 'origin']
    const request = await db
      .getRepository(RequestBandUpdate)
      .findOne({ where: { id: reqId }, relations: { band: true } })

    if (!request) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Update request or band not found.',
      })
    }

    const { artists, band, ...requestClean } = request
    const artistsParsed = JSON.parse(artists)

    const updated = Object.fromEntries(
      Object.entries(requestClean).filter(([key]) => list.includes(key))
    )

    const original = Object.fromEntries(
      Object.entries(band).filter(([key]) => list.includes(key))
    )

    const changes: { [key: string]: any } = {}

    Object.keys(updated).forEach((v) => {
      if (updated[v] !== original[v]) {
        changes[v] = { old: original[v], new: updated[v] }
      }
    })

    console.log(changes)

    return { band: {id: band.id, name: band.name}, updated, changes, artists: artistsParsed, info: request.info }
  })
