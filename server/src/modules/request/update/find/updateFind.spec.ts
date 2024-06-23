import { fakeArtist, fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Artist, RequestUpdate, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import router from '..'
import { authContext } from '@tests/utils/context'

const createCaller = createCallerFactory(router)

it('should find all artists', async () => {
  const db = await createTestDatabase()
  const entity = 'ARTIST'

  const dummyData = JSON.stringify({name: 'John'})
  const user = await db.getRepository(User).save(fakeUser())
  const artist = await db.getRepository(Artist).save(fakeArtist())

  const data = {
    data: dummyData,
    userId: user.id,
    entityId: artist.id,
    entity
  }

  const requests = await db
    .getRepository(RequestUpdate)
    .save([fakeRequest(data), fakeRequest(data)])

    requests.map((r) => (r.data = JSON.parse(r.data)))

  const { find } = createCaller(authContext({ db }))

  const reqList = await find(entity)

  expect(reqList).toHaveLength(2)
})
