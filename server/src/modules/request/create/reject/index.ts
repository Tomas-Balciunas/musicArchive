import { RequestCreate, reqSchema } from "@server/entities/request/create";
import { authProcedure } from "@server/trpc/procedures";

export default authProcedure
.input(reqSchema.shape.id)
.mutation(async ({input: rId, ctx: {db}}) => {
    const rejectedRequest = await db.getRepository(RequestCreate).update({id: rId}, {status: 'rejected'})
    
    return rejectedRequest
})