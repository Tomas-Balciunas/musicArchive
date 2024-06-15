import { Band, bandSchema, type BandFull } from '@server/entities/band'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .input(bandSchema.shape.id)
  .query(async ({ input: bandId, ctx: { db } }) => {
    const band = (await db.getRepository(Band).findOne({
      where: { id: bandId },
      relations: {
        albums: true,
        artists: true,
        posts: { user: true },
      },
      select: {
        albums: true,
        artists: {
          id: true,
          name: true,
        },
        posts: {
          id: true,
          body: true,
          createdAt: true,
          user: {
            username: true,
          },
        },
      },
    })) as BandFull

    if (!band) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Band was not found`,
      })
    }

    return band
  })
