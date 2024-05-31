import { fakeAlbum, fakeBand } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Album, Band } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'

const createCaller = createCallerFactory(router)

it('should get one album', async () => {
  const db = await createTestDatabase()
  const bandFake = await db.getRepository(Band).save(fakeBand())
  const [album1, album2] = await db
    .getRepository(Album)
    .save([
      fakeAlbum({ bandId: bandFake.id }),
      fakeAlbum({ bandId: bandFake.id }),
    ])
  const { get } = createCaller({ db })

  const { band, reviews, songs, artists, ...albumClean } = await get(album2.id)

  expect(albumClean).toBeTypeOf('object')
  expect(albumClean).toMatchObject({
    id: expect.any(Number),
    title: album2.title,
    bandId: band.id,
  })
  expect(albumClean).not.toMatchObject({
    id: expect.any(Number),
    title: album1.title,
    bandId: band.id,
  })
})
