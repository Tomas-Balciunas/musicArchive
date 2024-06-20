import { router } from "@server/trpc";
import add from "./add";
import approve from "./approve";
import find from "./find";
import get from "./get";
import reject from "./reject";

export default router({
    add,
    approve,
    find,
    get,
    reject
})