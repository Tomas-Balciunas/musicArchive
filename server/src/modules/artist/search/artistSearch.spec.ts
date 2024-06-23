import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Album, Artist, Band } from '@server/entities'
import { fakeAlbum, fakeArtist, fakeBand } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import router from '..'

const createCaller = createCallerFactory(router)

it('should return artists for album based on search query', async () => {
  const db = await createTestDatabase()
  const band = await db.getRepository(Band).save(fakeBand())

  const artists = await db
    .getRepository(Artist)
    .save([
      fakeArtist({ name: 'john' }),
      fakeArtist({ name: 'John' }),
      fakeArtist({ name: 'jane' }),
    ])

  const albumRepo = db.getRepository(Album)
  const album = albumRepo.create(fakeAlbum({ bandId: band.id }))
  album.artists = artists
  albumRepo.save(album)

  const { search } = createCaller(authContext({ db }))

  const searchResults = await search({ name: 'john', albumId: album.id })

  expect(searchResults).toHaveLength(2)
  expect(
    searchResults.every((a) => a.name.toLowerCase() === 'john')
  ).toBeTruthy()
})

it('should return artists for band based on search query', async () => {
  const db = await createTestDatabase()
  const bandRepo = db.getRepository(Band)

  const artists = await db
    .getRepository(Artist)
    .save([
      fakeArtist({ name: 'john' }),
      fakeArtist({ name: 'John' }),
      fakeArtist({ name: 'jane' }),
    ])

  const band = bandRepo.create(fakeBand())
  band.artists = artists
  bandRepo.save(band)

  const { search } = createCaller(authContext({ db }))

  const searchResults = await search({ name: 'john', bandId: band.id })

  expect(searchResults).toHaveLength(2)
  expect(
    searchResults.every((a) => a.name.toLowerCase() === 'john')
  ).toBeTruthy()
})
