import { createCallerFactory } from '@server/trpc'
import router from '..'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { Album, Artist, Band, RequestUpdate, User } from '@server/entities'
import {
  fakeAlbum,
  fakeArtist,
  fakeBand,
  fakeRequest,
  fakeUser,
} from '@server/entities/tests/fakes'
import { AlbumApproved } from '@server/entities/album'
import { BandApproved } from '@server/entities/band'
import { ArtistBare } from '@server/entities/artist'

const createCaller = createCallerFactory(router)
const db = await createTestDatabase()
const user = await db.getRepository(User).save(fakeUser())
const band = await db.getRepository(Band).save(fakeBand())
const artist = await db.getRepository(Artist).save(fakeArtist())
const album = await db.getRepository(Album).save(fakeAlbum({ bandId: band.id }))

it('should approve album update', async () => {
  const entity = 'ALBUM'
  const { approve } = createCaller(authContext({ db }))

  const data = {
    title: 'Test',
    released: 1999,
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

  const insert = updateInsert(entity, album.id, data)

  const req = await db
    .getRepository(RequestUpdate)
    .save(fakeRequest({ ...insert, userId: user.id }))

  const updatedBand = (await approve({ id: req.id, entity })) as AlbumApproved

  expect(updatedBand.title).not.toEqual(album.title)
  expect(updatedBand.artists).toHaveLength(1)
  expect(updatedBand.songs).toHaveLength(1)
})

it('should approve band update', async () => {
  const entity = 'BAND'
  const { approve } = createCaller(authContext({ db }))

  const data = {
    name: 'Test',
    formed: null,
    origin: null,
    artists: [
      {
        id: artist.id,
        name: artist.name,
      },
    ],
  }

  const insert = updateInsert(entity, band.id, data)

  const req = await db
    .getRepository(RequestUpdate)
    .save(fakeRequest({ ...insert, userId: user.id }))

  const updatedBand = (await approve({ id: req.id, entity })) as BandApproved

  expect(updatedBand.name).not.toEqual(band.name)
  expect(updatedBand.artists).toHaveLength(1)
})

it('should approve artist update', async () => {
  const entity = 'ARTIST'
  const { approve } = createCaller(authContext({ db }))

  const data = {
    name: 'Test',
    birth: null,
  }

  const insert = updateInsert(entity, artist.id, data)

  const req = await db
    .getRepository(RequestUpdate)
    .save(fakeRequest({ ...insert, userId: user.id }))

  const updatedArtist = (await approve({ id: req.id, entity })) as ArtistBare

  expect(updatedArtist.name).not.toEqual(artist.name)
})

function updateInsert(entity: string, entityId: number, data: object) {
  const dataJson = JSON.stringify(data)

  return {
    entity,
    entityId,
    data: dataJson,
    info: 'dummy',
  }
}
