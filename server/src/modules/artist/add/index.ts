import { artistAddSchema } from '@server/entities/artist'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { addArtist, getRepo } from '../services'

export default authenticatedProcedure
  .input(artistAddSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const { albumId, bandId, artistId } = input

    const [id, repo] = getRepo(db, albumId, bandId)
    const result = addArtist(db, id, artistId, repo)

    return result
  })
