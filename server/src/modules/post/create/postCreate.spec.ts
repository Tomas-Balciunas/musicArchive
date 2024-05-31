import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { Band, User } from '@server/entities'
import { fakeBand, fakeUser } from '@server/entities/tests/fakes'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create a post', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const band = await db.getRepository(Band).save(fakeBand())

  const { create } = createCaller(authContext({ db }, user))

  const postInsert = {
    body: 'Post Body',
    bandId: band.id,
    userId: user.id
  }

  const postCreated = await create(postInsert)

  expect(postCreated).toMatchObject({
    id: expect.any(Number),
    ...postInsert,
    createdAt: expect.any(Date)
  })
})