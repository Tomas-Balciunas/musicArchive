import { Artist, Band } from '@server/entities'
import { BandBare, BandFull, BandUpdate } from '@server/entities/band'
import { TRPCError } from '@trpc/server'
import { DataSource, In } from 'typeorm'

export async function updateBand(
  db: DataSource,
  data: BandUpdate,
  id: number
): Promise<BandBare> {
  const { artists, ...base } = data

  const bandRepo = db.getRepository(Band)
  const artistRepo = db.getRepository(Artist)

  await bandRepo.update({ id }, base)

  if (artists.length) {
    const idList = data.artists.map((a) => a.id)

    const band = await bandRepo.findOne({
      where: { id },
      relations: ['artists'],
    })

    if (!band) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Band not found.',
      })
    }

    const list = await artistRepo.find({
      where: { id: In(idList) },
    })

    list.forEach((a) => band.artists.push(a))
    await bandRepo.save(band)
  }

  const updatedBand = await bandRepo.findOne({
    where: { id },
    relations: ['artists'],
  })

  return updatedBand
}

export async function bandChanges() {}

export async function getBand(id: number, db: DataSource): Promise<BandFull> {
  const band = (await db.getRepository(Band).findOne({
    where: { id },
  })) as BandFull

  return band
}
