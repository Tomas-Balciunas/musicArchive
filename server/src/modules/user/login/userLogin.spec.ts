import bcrypt from 'bcrypt'
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
  const hash = await bcrypt.hash(PW, 6)
  await db.getRepository(User).save(fakeUser({ password: hash, email: EMAIL }))

  const credentials = {
    email: EMAIL,
    password: PW,
  }

  const { login } = createCaller({ db })

  const { accessToken } = await login(credentials)

  expect(accessToken).toEqual(expect.any(String))
})
