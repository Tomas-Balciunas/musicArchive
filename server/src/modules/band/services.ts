import { BAND_NOT_FOUND } from '@server/consts'
import { Artist, Band } from '@server/entities'
import {
  type BandMinimal,
  type BandApproved,
  type BandFull,
  type BandUpdate,
} from '@server/entities/band'
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
      const band = await getBand(id, db)

      const idList = data.artists.map((a) => a.id)

      const list = await artistRepo.find({
        where: { id: In(idList) },
      })

      list.forEach((a) => band.artists.push(a))

      await bandRepo.save(band)
    }

    await queryRunner.commitTransaction()
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    await queryRunner.release()
  }

  const updatedBand = await getBand(id, db, ['artists'])

  return updatedBand
}

export async function getBand(
  id: number,
  db: DataSource,
  relations: string[] = ['artists', 'albums', 'posts']
): Promise<BandFull> {
  const band = (await db.getRepository(Band).findOne({
    where: { id },
    relations,
  })) as BandFull

  if (!band) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: BAND_NOT_FOUND,
    })
  }

  return band
}

export async function getBandMinimal(
  id: number,
  db: DataSource
): Promise<BandMinimal> {
  const band = (await db.getRepository(Band).findOne({
    where: { id },
    select: { id: true, name: true },
  })) as BandMinimal

  if (!band) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: BAND_NOT_FOUND,
    })
  }

  return band
}

export async function findBandsMinimal(db: DataSource): Promise<BandMinimal[]> {
  const bands: BandMinimal[] = await db.getRepository(Band).find({
    select: { id: true, name: true },
    where: { pending: false }
  })

  return bands
}
