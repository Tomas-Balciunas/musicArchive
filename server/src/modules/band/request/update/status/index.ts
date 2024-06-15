import { RequestBandUpdate, reqSchema } from "@server/entities/band/request_update";
import { authProcedure } from "@server/trpc/procedures";

export default authProcedure
.input(reqSchema.pick({id: true, status: true}))
.mutation(async ({input, ctx: {db}}) => {
    const {id, status} = input
    const updatedStatus = await db.getRepository(RequestBandUpdate).update({id}, {status})

    return updatedStatus
})