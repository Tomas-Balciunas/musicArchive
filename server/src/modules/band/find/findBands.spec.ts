import { fakeBand } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Band } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'

const createCaller = createCallerFactory(router)

it('should find all bands', async () => {
  const db = await createTestDatabase()

  const bands = await db
    .getRepository(Band)
    .save([fakeBand(), fakeBand()])

  const { find } = createCaller({ db })

  const bandList = await find()
  const cleanedList = bandList.map((band) => {
    const {posts, albums, artists, ...cleanBand} = band
    return cleanBand
  })

  expect(cleanedList).toHaveLength(2)
  expect(cleanedList).toMatchObject(bands)
})
