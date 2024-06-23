import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeArtist, fakeUser } from '@server/entities/tests/fakes'
import { Artist, User } from '@server/entities'
import { InsertUpdate } from '@server/shared/entities'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create an update request', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const artist = await db.getRepository(Artist).save(fakeArtist())

  const { add } = createCaller(authContext({ db }, user))

  const request: InsertUpdate = {
    entityId: artist.id,
    entity: 'ARTIST',
    info: 'info',
    name: 'John',
    birth: null,
  }

  const response = await add(request)

  expect(response).toMatchObject({
    entityId: request.entityId,
    entity: request.entity,
    info: request.info,
    data: expect.any(String),
    createdAt: expect.any(Date)
  })
  expect(JSON.parse(response.data)).toMatchObject({name: request.name, birth: request.birth})
})