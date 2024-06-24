import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { RequestCreate, User } from '@server/entities'
import router from '..'

const createCaller = createCallerFactory(router)
const db = await createTestDatabase()
const user = await db.getRepository(User).save(fakeUser())
const { get } = createCaller(authContext({ db }, user))

it('should get an artist create request', async () => {
  const entity = 'ARTIST'
  const data = {
    name: 'John',
  }

  const dataJson = JSON.stringify(data)

  const req = await db
    .getRepository(RequestCreate)
    .save(fakeRequest({ data: dataJson, userId: user.id, entity }))

  const response = await get(req.id)

  expect(response).toMatchObject({ ...req, data, userId: user.id })
  expect(response.data).toMatchObject(data)
})

it('should get an album create request', async () => {
  const entity = 'ALBUM'
  const data = {
    title: 'Album',
  }

  const dataJson = JSON.stringify(data)

  const req = await db
    .getRepository(RequestCreate)
    .save(fakeRequest({ data: dataJson, userId: user.id, entity }))

  const response = await get(req.id)

  expect(response).toMatchObject({ ...req, data, userId: user.id })
  expect(response.data).toMatchObject(data)
})
