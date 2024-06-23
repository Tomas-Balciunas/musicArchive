import { fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { RequestCreate, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'
import { authContext } from '@tests/utils/context'

const createCaller = createCallerFactory(router)

it('should find all artists', async () => {
  const db = await createTestDatabase()
  const entity = 'ARTIST'

  const dummyData = JSON.stringify({name: 'John'})
  const user = await db.getRepository(User).save(fakeUser())

  const data = {
    data: dummyData,
    userId: user.id,
    entity
  }

  const requests = await db
    .getRepository(RequestCreate)
    .save([fakeRequest(data), fakeRequest(data)])

    requests.map((r) => (r.data = JSON.parse(r.data)))

  const { find } = createCaller(authContext({ db }))

  const reqList = await find(entity)

  expect(reqList).toHaveLength(2)
  expect(reqList).toMatchObject(requests)
})
