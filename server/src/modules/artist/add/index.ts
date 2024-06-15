import { artistAddSchema } from '@server/entities/artist'
import { authProcedure } from '@server/trpc/procedures'
import { addArtist, getRepo } from '../services'

export default authProcedure
  .input(artistAddSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const { albumId, bandId, artistId } = input

    const [id, repo] = getRepo(db, albumId, bandId)
    const result = addArtist(db, id, artistId, repo)

    return result
  })
