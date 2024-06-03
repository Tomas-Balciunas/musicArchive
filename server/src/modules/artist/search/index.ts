import { Album, Band } from '@server/entities'
import { Artist, artistSearchSchema } from '@server/entities/artist'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { ILike, In, Not } from 'typeorm'

export default authenticatedProcedure
  .input(artistSearchSchema)
  .query(async ({ input, ctx: { db } }) => {
    const { name, albumId, bandId } = input

    async function getCurrentArtists() {
      if (albumId) {
        const result = await db.getRepository(Album).find({
          relations: {
            artists: true,
          },
          select: {
            artists: {
              id: true,
            },
          },
          where: {
            id: albumId,
          },
        })

        return result
      }

      if (bandId) {
        const result = await db.getRepository(Band).find({
          relations: {
            artists: true,
          },
          select: {
            artists: {
              id: true,
            },
          },
          where: {
            id: bandId,
          },
        })

        return result
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to retrieve artists',
      })
    }

    const currentArtists = await getCurrentArtists()

    const currentArtistList = currentArtists.flatMap((entity) =>
      entity.artists.map((artist) => artist.id)
    )

    const foundArtists = await db.getRepository(Artist).find({
      where: { name: ILike(`%${name}%`), id: Not(In(currentArtistList)) },
    })

    return foundArtists
  })
