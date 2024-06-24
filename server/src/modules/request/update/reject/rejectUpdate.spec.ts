import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeArtist, fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { Artist, RequestUpdate, User } from '@server/entities'
import router from '..'

const createCaller = createCallerFactory(router)

it('should reject a request', async () => {
  const db = await createTestDatabase()
  const { reject } = createCaller(authContext({ db }))
  const artist = await db.getRepository(Artist).save(fakeArtist())
  const user = await db.getRepository(User).save(fakeUser())

  const request = await db
    .getRepository(RequestUpdate)
    .save(
      fakeRequest({
        userId: user.id,
        entity: 'ARTIST',
        entityId: artist.id,
        data: 'dummy',
      })
    )

  await reject(request.id)

  const rejected = await db
    .getRepository(RequestUpdate)
    .findOne({ where: { id: request.id } })

  expect(rejected?.status).toBe('rejected')
})
