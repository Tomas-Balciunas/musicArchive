import { fakeBand } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Band } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { BAND_NOT_FOUND } from '@server/consts'
import router from '..'

const createCaller = createCallerFactory(router)

it('should get one band', async () => {
  const db = await createTestDatabase()

  const [band1, band2] = await db
    .getRepository(Band)
    .save([fakeBand(), fakeBand()])

  const { get } = createCaller({ db })

  const { posts, albums, artists, ...bandClean } = await get(band2.id)

  expect(bandClean).toBeTypeOf('object')
  expect(bandClean).toMatchObject({
    id: expect.any(Number),
    name: band2.name,
    description: band2.description
  })
  expect(bandClean).not.toMatchObject({
    id: expect.any(Number),
    name: band1.name,
    bandId: band2.description
  })
})

it('should throw not found error', async () => {
  const db = await createTestDatabase()

  const artist = await db.getRepository(Band).save(fakeBand())

  const { get } = createCaller({ db })

  expect(get(artist.id + 1)).rejects.toThrow(BAND_NOT_FOUND)
})
