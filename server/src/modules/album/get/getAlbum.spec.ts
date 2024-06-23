import { fakeAlbum, fakeBand } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Album, Band } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'
import { ALBUM_NOT_FOUND } from '@server/consts'

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

  const foundAlbum = await get(album2.id)

  expect(foundAlbum.id).toBe(album2.id)
  expect(foundAlbum.id).not.toBe(album1.id)
})

it('should throw not found error', async () => {
  const db = await createTestDatabase()

  const band = await db.getRepository(Band).save(fakeBand())
  const album = await db.getRepository(Album).save(fakeAlbum({bandId: band.id}))

  const { get } = createCaller({ db })

  expect(get(album.id + 1)).rejects.toThrow(ALBUM_NOT_FOUND)
})
