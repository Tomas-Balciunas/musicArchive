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
    .save([fakeBand({pending: false}), fakeBand({pending: false})])

  const { find } = createCaller({ db })

  const bandList = await find()
  const bandsList = bands.map((band) => {
    const {id, name, description} = band
    return {id, name, description}
  })
  const cleanedList = bandList.map((band) => {
    const {id, name, description} = band
    return {id, name, description}
  })

  expect(cleanedList).toHaveLength(2)
  expect(cleanedList).toMatchObject(bandsList)
})
