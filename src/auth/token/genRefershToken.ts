import User from "@objects/users/user"
import jwt from 'jsonwebtoken';
import hashHmacSha256 from "@auth/hashing/hashing"
import { genKey } from "./genAccessToken";
export function genRefreshToken(user:User) {
    const jwt_key = `${process.env.JWT_SECRET_KEY}`;
    const userId = user.userId;
    const role = user.role;
    const type = 'refresh';
    const username = user.username
    const password = user.password;
    const key = genKey(userId, password);
    const tokenPayload = { type,username, userId, role, key };
    const refreshToken = jwt.sign(tokenPayload, jwt_key);
    return refreshToken;
  }