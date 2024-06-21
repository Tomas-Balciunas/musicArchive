import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { Album, Band, User } from '@server/entities'
import { fakeAlbum, fakeBand, fakeUser } from '@server/entities/tests/fakes'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create a song', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const band = await db.getRepository(Band).save(fakeBand())
  const album = await db.getRepository(Album).save(fakeAlbum({bandId: band.id}))

  const { create } = createCaller(authContext({ db }, user))

  const songInsert = {
    title: 'song title',
    duration: 999,
    album
  }

  const reviewCreated = await create(songInsert)

  expect(reviewCreated).toMatchObject({
    id: expect.any(Number),
    ...songInsert
  })
})