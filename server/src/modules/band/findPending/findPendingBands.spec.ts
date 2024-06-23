import { fakeBand } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Band } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'
import { authContext } from '@tests/utils/context'

const createCaller = createCallerFactory(router)

it('should find all pending bands', async () => {
  const db = await createTestDatabase()

  const [band, bandPending ] = await db
    .getRepository(Band)
    .save([fakeBand({pending: false}), fakeBand({pending: true})])

  const { findPending } = createCaller(authContext({ db }))

  const bandList = await findPending()

  const cleanedList = bandList.map((band) => {
    const {id} = band
    return {id}
  })

  expect(bandList).toHaveLength(1)
  expect(cleanedList).toMatchObject([{
    id: bandPending.id
  }])
})
