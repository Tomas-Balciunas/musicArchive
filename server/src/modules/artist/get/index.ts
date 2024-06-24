import { artistSchema } from '@server/entities/artist'
import { publicProcedure } from '@server/trpc'
import { getArtist } from '../services'

export default publicProcedure
  .input(artistSchema.shape.id)
  .query(async ({ input: id, ctx: { db } }) => {
    const artist = await getArtist(id, db)

    return artist
  })
