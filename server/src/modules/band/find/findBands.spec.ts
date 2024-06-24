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
    .save([fakeBand({ pending: false }), fakeBand({ pending: false })])

  const { find } = createCaller({ db })

  const data = await find()

  const insertList = bands.map((band) => {
    const { id, name } = band
    return { id, name }
  })
  const foundList = data.map((band) => {
    const { id, name } = band
    return { id, name }
  })

  expect(foundList).toHaveLength(2)
  expect(foundList).toMatchObject(insertList)
})
