
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import { Artist } from '@server/entities'
import { fakeArtist } from '@server/entities/tests/fakes'
import router from '..'

const createCaller = createCallerFactory(router)

it('should update an artist', async () => {
    const db = await createTestDatabase()
    const { update } = createCaller(authContext({ db }))
    const artist = await db.getRepository(Artist).save(fakeArtist())

    const data = {
        id: artist.id,
        name: 'Test',
        birth: null,
      }

    const updatedArtist = await update(data)

    expect(updatedArtist.name).not.toEqual(artist.name)
})