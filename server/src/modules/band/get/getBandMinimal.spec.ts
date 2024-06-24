import { fakeBand } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Band } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { BAND_NOT_FOUND } from '@server/consts'
import router from '..'

const createCaller = createCallerFactory(router)

it('should get one band, minimal select', async () => {
  const db = await createTestDatabase()

  const [band1, band2] = await db
    .getRepository(Band)
    .save([fakeBand(), fakeBand()])

  const { getMinimal } = createCaller({ db })

  const band = await getMinimal(band2.id)

  expect(band).toMatchObject({
    id: band2.id,
    name: band2.name,
  })
  expect(band).not.toMatchObject({
    id: band1.id,
    name: band1.name,
  })
})

it('should throw not found error', async () => {
  const db = await createTestDatabase()

  const artist = await db.getRepository(Band).save(fakeBand())

  const { getMinimal } = createCaller({ db })

  expect(getMinimal(artist.id + 1)).rejects.toThrow(BAND_NOT_FOUND)
})
