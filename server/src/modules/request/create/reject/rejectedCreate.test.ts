import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { RequestCreate, User } from '@server/entities'
import router from '..'

const createCaller = createCallerFactory(router)

it('should reject a request', async () => {
  const db = await createTestDatabase()
  const { reject } = createCaller(authContext({ db }))
  const user = await db.getRepository(User).save(fakeUser())

  const request = await db
    .getRepository(RequestCreate)
    .save(
      fakeRequest({
        userId: user.id,
        entity: 'ARTIST',
        data: 'dummy',
      })
    )

  await reject(request.id)

  const rejected = await db
    .getRepository(RequestCreate)
    .findOne({ where: { id: request.id } })

  expect(rejected?.status).toBe('rejected')
})