import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities'
import { InsertCreate } from '@server/shared/entities'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create a create request', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const { add } = createCaller(authContext({ db }, user))

  const request: InsertCreate = {
    entity: 'ARTIST',
    info: 'info',
    name: 'John',
    birth: null,
  }

  const response = await add(request)

  expect(response).toMatchObject({
    entity: request.entity,
    info: request.info,
    data: expect.any(String),
    createdAt: expect.any(Date)
  })
  expect(JSON.parse(response.data)).toMatchObject({name: request.name, birth: request.birth})
})
