import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
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
