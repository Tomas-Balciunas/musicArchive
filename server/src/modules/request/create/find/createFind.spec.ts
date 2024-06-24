import { fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { RequestCreate, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { authContext } from '@tests/utils/context'
import router from '..'

const createCaller = createCallerFactory(router)
const db = await createTestDatabase()
const { find } = createCaller(authContext({ db }))
const user = await db.getRepository(User).save(fakeUser())

async function findEntities(entity: 'ARTIST' | 'ALBUM', dummyData: string) {
  const data = {
    data: dummyData,
    userId: user.id,
    entity,
  }

  await db
    .getRepository(RequestCreate)
    .save([fakeRequest(data), fakeRequest(data)])

  const entities = await find(entity)

  return entities
}

it('should find all artist create requests', async () => {
  const entity = 'ARTIST'

  const dummyData = JSON.stringify({ name: 'John' })

  const result = await findEntities(entity, dummyData)

  expect(result).toHaveLength(2)
})

it('should find all album create requests', async () => {
  const entity = 'ALBUM'

  const dummyData = JSON.stringify({ title: 'Album' })

  const result = await findEntities(entity, dummyData)

  expect(result).toHaveLength(2)
})

