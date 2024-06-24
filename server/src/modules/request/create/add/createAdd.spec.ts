import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { fakeArtist, fakeBand, fakeUser } from '@server/entities/tests/fakes'
import { Artist, Band, User } from '@server/entities'
import { InsertCreate } from '@server/shared/entities'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create an artist create request', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const { add } = createCaller(authContext({ db }, user))

  const request: InsertCreate = {
    entity: 'ARTIST',
    info: 'info',
    name: 'John',
    birth: null,
  }

  const response = await add(request)

  expect(response).toMatchObject({
    entity: request.entity,
    info: request.info,
    data: expect.any(String),
    createdAt: expect.any(Date),
  })
  expect(JSON.parse(response.data)).toMatchObject({
    name: request.name,
    birth: request.birth,
  })
})

it('should create an album create request', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const band = await db.getRepository(Band).save(fakeBand())
  const artist = await db.getRepository(Artist).save(fakeArtist())

  const { add } = createCaller(authContext({ db }, user))

  const data = {
    title: 'title',
    released: 1999,
    bandId: band.id,
    artists: [{ id: artist.id, name: artist.name }],
    songs: [{ title: 'song', duration: 200 }],
  }

  const request: InsertCreate = {
    entity: 'ALBUM',
    info: 'info',
    ...data,
  }

  const response = await add(request)

  expect(response).toMatchObject({
    entity: request.entity,
    info: request.info,
    data: expect.any(String),
    createdAt: expect.any(Date),
  })
  expect(response.data).toMatchObject(JSON.stringify(data))
})
