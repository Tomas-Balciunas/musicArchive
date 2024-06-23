import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Artist } from '@server/entities'
import { fakeArtist } from '@server/entities/tests/fakes'
import { ARTIST_NOT_FOUND } from '@server/consts'
import router from '..'

const createCaller = createCallerFactory(router)

it('should return specific artist', async () => {
  const db = await createTestDatabase()

  const [artist1, artist2] = await db
    .getRepository(Artist)
    .save([fakeArtist(), fakeArtist()])

  const { get } = createCaller({ db })

  const artistGet = await get(artist2.id)

  expect(artistGet).toMatchObject(artist2)
  expect(artistGet).not.toMatchObject(artist1)
})

it('should throw not found error', async () => {
  const db = await createTestDatabase()

  const artist = await db.getRepository(Artist).save(fakeArtist())

  const { get } = createCaller({ db })

  expect(get(artist.id + 1)).rejects.toThrow(ARTIST_NOT_FOUND)
})
