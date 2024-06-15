import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import { createCallerFactory, router } from '..'
import { adminProcedure } from '.'

const routes = router({
  adminRoute: adminProcedure.query(() => 'access'),
})

const db = await createTestDatabase()
const createCaller = createCallerFactory(routes)
const [user1, user2] = await db
  .getRepository(User)
  .save([fakeUser({ role: 2 }), fakeUser({ role: 1 })])

it('should allow access to admin route', async () => {
  const caller = createCaller(authContext({ db }, user1))
  const test = await caller.adminRoute()

  expect(test).toBe('access')
})

it('should not allow access to admin route', async () => {
  const caller = createCaller(authContext({ db }, user2))

  expect(caller.adminRoute()).rejects.toThrow(/unauthorized/i)
})
