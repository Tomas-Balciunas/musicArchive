import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create a band', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const { create } = createCaller(authContext({ db }, user))

  const bandInsert = {
    name: 'Band Name',
    description: 'Band desc'
  }

  const bandCreated = await create(bandInsert)

  expect(bandCreated).toMatchObject({
    id: expect.any(Number),
    ...bandInsert
  })
})
