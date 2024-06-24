import { Album, Band } from '@server/entities'
import { Artist, artistSearchSchema } from '@server/entities/artist'
import { authProcedure } from '@server/trpc/procedures'
import { ILike, In, Not } from 'typeorm'

export default authProcedure
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

      return 0
    }

    const currentArtists = await getCurrentArtists()

    if (!currentArtists) {
      return []
    }

    const currentArtistList = currentArtists.flatMap((entity) =>
      entity.artists.map((artist) => artist.id)
    )

    const foundArtists = await db.getRepository(Artist).find({
      where: { name: ILike(`%${name}%`), id: Not(In(currentArtistList)) },
      take: 10,
    })

    return foundArtists
  })
