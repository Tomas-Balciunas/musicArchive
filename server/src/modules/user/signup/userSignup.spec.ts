import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import router from '..'

const createCaller = createCallerFactory(router)
const PW = 'Password.123!'
const EMAIL = 'mail@mail.com'

it('should return access token', async () => {
  const db = await createTestDatabase()

  const credentials = {
    username: 'username',
    email: EMAIL,
    password: PW,
  }

  const { signup } = createCaller({ db })

  const createdUser = await signup(credentials)

  expect(createdUser).toMatchObject({
    id: expect.any(Number),
    username: credentials.username,
    email: credentials.email
  })
})

it('should throw error on duplicate email', async () => {
  const db = await createTestDatabase()

  await db.getRepository(User).save(fakeUser({email: EMAIL}))

  const credentials = {
    username: 'username',
    email: EMAIL,
    password: PW,
  }

  const { signup } = createCaller({ db })

  expect(signup(credentials)).rejects.toThrow()
})
