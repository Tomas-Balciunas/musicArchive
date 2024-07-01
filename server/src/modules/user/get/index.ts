import { User } from '@server/entities'
import { type IdentifierUser } from '@server/entities/user'
import { authProcedure } from '@server/trpc/procedures'

export default authProcedure.query(async ({ ctx: { db, authUser } }) => {
  const userInfo = (await db.getRepository(User).findOne({
    where: { id: authUser.id },
    select: {
      username: true,
      role: true
    },
  })) as IdentifierUser

  return userInfo
})
