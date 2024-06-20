import { RequestUpdate, reqUpdateSchema } from "@server/entities/request/update";
import { authProcedure } from "@server/trpc/procedures";

export default authProcedure
.input(reqUpdateSchema.shape.id)
.mutation(async ({input: rId, ctx: {db}}) => {
    const rejectedRequest = await db.getRepository(RequestUpdate).update({id: rId}, {status: 'rejected'})
    
    return rejectedRequest
})