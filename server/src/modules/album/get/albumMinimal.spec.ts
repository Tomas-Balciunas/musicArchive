import { fakeAlbum, fakeBand } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Album, Band } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'

const createCaller = createCallerFactory(router)

it('should get one partial album', async () => {
  const db = await createTestDatabase()
  const band = await db.getRepository(Band).save(fakeBand())
  const album = await db
    .getRepository(Album)
    .save(
      fakeAlbum({ bandId: band.id }),)
  const { reviewData } = createCaller({ db })

  const albumClean = await reviewData(album.id)

  expect(albumClean).toBeTypeOf('object')
  expect(albumClean).toMatchObject({
    id: expect.any(Number),
    title: album.title,
    band: {
        id: band.id,
        name: band.name,
    }
  })
})