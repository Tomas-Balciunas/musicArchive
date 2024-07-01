import { router } from '@server/trpc'
import signup from './signup'
import login from './login'
import get from './get'

export default router({
    signup,
    login,
    get
})
