import { createCallerFactory } from '@server/trpc'
import router from '..'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { RequestCreate, User } from '@server/entities'

const createCaller = createCallerFactory(router)

it('should get a create request', async () => {
  const entity = 'ARTIST'
  const data = {
    name: 'John',
    birth: null,
  }

  const dataJson = JSON.stringify(data)

  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const req = await db
    .getRepository(RequestCreate)
    .save(fakeRequest({ data: dataJson, userId: user.id, entity }))

  const { get } = createCaller(authContext({ db }, user))

  const response = await get(req.id)

  expect(response).toMatchObject({...req, data, userId: user.id})
  expect(response.data).toMatchObject(data)
})
