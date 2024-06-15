import { publicProcedure } from '..'
import { authMidleware, adminMiddleware } from '../middlewares'

export const authProcedure = publicProcedure.use(authMidleware)
export const adminProcedure = authProcedure.use(adminMiddleware)
