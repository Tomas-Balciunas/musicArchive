import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeArtist, fakeRequest, fakeUser } from '@server/entities/tests/fakes'
import { Artist, RequestUpdate, User } from '@server/entities'
import { ArtistUpdate } from '@server/entities/artist'
import router from '..'
import { findChanges, relationsSeparator } from '../../services'

const createCaller = createCallerFactory(router)

it('should get an update request', async () => {
  const entity = 'ARTIST'
  const data: ArtistUpdate = {
    name: 'John',
    birth: null,
  }

  const { keys } = relationsSeparator(data)

  const dataJson = JSON.stringify(data)

  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const artist = await db.getRepository(Artist).save(fakeArtist())
  const req = await db
    .getRepository(RequestUpdate)
    .save(
      fakeRequest({
        data: dataJson,
        userId: user.id,
        entity,
        entityId: artist.id,
      })
    )

  const { get } = createCaller(authContext({ db }, user))

  const response = await get(req.id)

  expect(response).toMatchObject({
    comparison: findChanges(data, artist, keys).comparison(),
    userId: user.id,
    entityId: artist.id,
    createdAt: expect.any(Date),
  })
})
