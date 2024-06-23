import { authContext } from '@tests/utils/context'
import { fakeAlbum, fakeBand, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Album, Band, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'

const createCaller = createCallerFactory(router)
const db = await createTestDatabase()
const user = await db.getRepository(User).save(fakeUser())
const band = await db.getRepository(Band).save(fakeBand())

it('should create an album', async () => {
  const { create } = createCaller(authContext({ db }, user))

  const albumCreated = await create({
    title: 'Album Title',
    bandId: band.id,
    artists: [],
    songs: [],
    released: 2000,
  })

  expect(albumCreated).toMatchObject({
    id: expect.any(Number),
    title: 'Album Title',
    bandId: band.id,
  })
})

it('should fail validation for an existing album', async () => {
  await db
    .getRepository(Album)
    .save(fakeAlbum({ title: 'Album Title', bandId: band.id }))

  const { create } = createCaller(authContext({ db }, user))

  expect(
    create({
      title: 'Album Title',
      bandId: band.id,
      artists: [],
      songs: [],
      released: 2000,
    })
  ).rejects.toThrow()
})
