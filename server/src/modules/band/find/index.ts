import { type BandMinimal  } from '@server/entities/band'
import { publicProcedure } from '@server/trpc'
import { findBandsMinimal } from '../services'

export default publicProcedure.query(async ({ ctx: { db } }) => {
  const bands: BandMinimal[] = await findBandsMinimal(db)

  return bands
})
