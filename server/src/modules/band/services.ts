import { BAND_NOT_FOUND } from '@server/consts'
import { Artist, Band } from '@server/entities'
import { BandApproved, BandFull, BandUpdate } from '@server/entities/band'
import { TRPCError } from '@trpc/server'
import { DataSource, In } from 'typeorm'

export async function updateBand(
  db: DataSource,
  data: BandUpdate,
  id: number
): Promise<BandApproved> {
  const { artists, ...base } = data

  const bandRepo = db.getRepository(Band)
  const artistRepo = db.getRepository(Artist)

  const queryRunner = db.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    if (Object.keys(base).length) {
      await bandRepo.update({ id }, base)
    }

    if (artists.length) {
      const band = await bandRepo.findOne({
        where: { id },
        relations: ['artists'],
      })

      if (!band) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: BAND_NOT_FOUND,
        })
      }

      if (artists.length) {
        const idList = data.artists.map((a) => a.id)

        const list = await artistRepo.find({
          where: { id: In(idList) },
        })

        list.forEach((a) => band.artists.push(a))
      }

      await bandRepo.save(band)
    }

    await queryRunner.commitTransaction()
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    await queryRunner.release()
  }

  const updatedBand = await bandRepo.findOne({
    where: { id },
    relations: ['artists'],
  })

  if (!updatedBand) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: BAND_NOT_FOUND,
    })
  }

  return updatedBand
}

export async function bandChanges() {}

export async function getBand(id: number, db: DataSource): Promise<BandFull> {
  const band = (await db.getRepository(Band).findOne({
    where: { id },
  })) as BandFull

  if (!band) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: BAND_NOT_FOUND,
    })
  }

  return band
}
