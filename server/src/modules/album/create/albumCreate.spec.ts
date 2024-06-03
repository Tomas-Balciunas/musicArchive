import { authContext } from '@tests/utils/context'
import { fakeBand, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Band, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import * as services from '../services'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create an album', async () => {
  vi.spyOn(services, 'albumExists').mockImplementation(async () => false)

  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const band = await db.getRepository(Band).save(fakeBand())

  const { create } = createCaller(authContext({ db }, user))

  const albumCreated = await create({
    title: 'Album Title',
    bandId: band.id,
    artistList: [],
  })

  expect(albumCreated).toMatchObject({
    id: expect.any(Number),
    title: 'Album Title',
    bandId: band.id,
  })
})
