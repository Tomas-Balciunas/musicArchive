import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { Band } from '@server/entities'
import { fakeBand } from '@server/entities/tests/fakes'
import router from '..'

const createCaller = createCallerFactory(router)

it('should create an artist with album link', async () => {
  const db = await createTestDatabase()

  const { create } = createCaller(authContext({ db }))

  const band = await db.getRepository(Band).save(fakeBand())

  const artistInsert = {
    name: 'Artist Name',
    birth: new Date('2000-01-01'),
    bandId: band.id
  }

  const {bands, ...artistClean} = await create(artistInsert)

  expect(artistClean).toMatchObject({
    id: expect.any(Number),
    name: artistInsert.name,
    birth: '2000-01-01',
  })
})