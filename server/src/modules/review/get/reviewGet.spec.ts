import {
  fakeAlbum,
  fakeBand,
  fakeReview,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Album, Band, Review, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'

const createCaller = createCallerFactory(router)

it('should get one review', async () => {
  const db = await createTestDatabase()
  const band = await db.getRepository(Band).save(fakeBand())
  const userFake = await db.getRepository(User).save(fakeUser())
  const albumFake = await db
    .getRepository(Album)
    .save(fakeAlbum({ bandId: band.id }))

  const [review1, review2] = await db
    .getRepository(Review)
    .save([
      fakeReview({ albumId: albumFake.id, userId: userFake.id }),
      fakeReview({ albumId: albumFake.id, userId: userFake.id }),
    ])

  const { get } = createCaller({ db })

  const { album, user, ...bandClean } = await get(review2.id)

  expect(bandClean).toBeTypeOf('object')
  expect(bandClean).toMatchObject({
    id: expect.any(Number),
    title: review2.title,
    body: review2.body,
    score: review2.score,
    albumId: review2.albumId
  })
  expect(bandClean).not.toMatchObject({
    id: expect.any(Number),
    title: review1.title,
    body: review1.body,
    score: review1.score,
  })
})
