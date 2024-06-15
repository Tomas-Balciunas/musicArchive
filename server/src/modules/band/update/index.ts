import { Artist } from '@server/entities/artist'
import { Band, bandIdSchema, bandUpdateSchema } from '@server/entities/band'
import { authProcedure } from '@server/trpc/procedures'
import { In } from 'typeorm'

export default authProcedure
  .input(
    bandUpdateSchema.extend({
      bandId: bandIdSchema.shape.id,
    })
  )
  .mutation(async ({ input, ctx: { db } }) => {
    const { bandId, artists, ...data } = input
    const arr = artists.map((a) => a.id)

    const bandRepo = db.getRepository(Band)
    const artistRepo = db.getRepository(Artist)

    if (artists.length) {
      const band = await bandRepo.findOne({
        where: { id: bandId },
        relations: { artists: true },
      })
      if (band) {
        const list = await artistRepo.find({
          where: { id: In(arr) },
        })

        list.forEach((a) => band.artists.push(a))
        await bandRepo.save(band)
      }
    }

    const updatedBand = await bandRepo.update({ id: bandId }, data)

    return updatedBand
  })
