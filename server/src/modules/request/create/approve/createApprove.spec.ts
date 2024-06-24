import { createCallerFactory } from '@server/trpc'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { Artist, Band, RequestCreate, User } from '@server/entities'
import {
  fakeArtist,
  fakeBand,
  fakeRequest,
  fakeUser,
} from '@server/entities/tests/fakes'
import { AlbumApproved } from '@server/entities/album'
import router from '..'

const createCaller = createCallerFactory(router)

it('should approve album create', async () => {
  const entity = 'ALBUM'
  const db = await createTestDatabase()
  const { approve } = createCaller(authContext({ db }))

  const user = await db.getRepository(User).save(fakeUser())
  const band = await db.getRepository(Band).save(fakeBand())
  const artist = await db.getRepository(Artist).save(fakeArtist())

  const data = {
    title: 'Test',
    released: 1999,
    bandId: band.id,
    songs: [
      {
        title: 'test song',
        duration: 500,
      },
    ],
    artists: [
      {
        id: artist.id,
        name: artist.name,
      },
    ],
  }

  const dataJson = JSON.stringify(data)
  const insert = {
    entity,
    data: dataJson,
    info: 'dummy',
  }

  const req = await db
    .getRepository(RequestCreate)
    .save(fakeRequest({ ...insert, userId: user.id }))

  const { title, released, bandId, ...relations } = (await approve({
    id: req.id,
    entity,
  })) as AlbumApproved

  expect({ title, released, bandId }).toEqual({
    title: data.title,
    released: data.released,
    bandId: band.id,
  })
  expect(relations.artists).toHaveLength(1)
  expect(relations.songs).toHaveLength(1)
})
