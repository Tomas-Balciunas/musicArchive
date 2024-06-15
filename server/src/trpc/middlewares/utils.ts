import jsonwebtoken from 'jsonwebtoken'
import config from "@server/config"
import { parseTokenPayload } from "@server/modules/user/tokenPayload"

const { tokenKey } = config.auth

export function getUserFromToken(token: string) {
    try {
      const tokenVerified = jsonwebtoken.verify(token, tokenKey)
      const tokenParsed = parseTokenPayload(tokenVerified)

      return tokenParsed.user
    } catch (error) {
      return null
    }
  }