import { router } from "@server/trpc";
import create from "./create";
import update from "./update";

export default router({
    create,
    update
})