import User from "@objects/users/user"
import jwt from 'jsonwebtoken';
import hashHmacSha256 from "@auth/hashing/hashing"
const FIFTEEN_MINUTES_IN_SECOND = 15 * 60;
const FIVE_MINUTES = 5 *60;
const ONE_MINUT = 1*60
const FIVE_SECONDS = 5;
export function genAccessToken(user:User) {
    let jwt_key = `${process.env.JWT_SECRET_KEY}`;
    const userId = user.userId;
    const password = user.password;
    const key = genKey(userId,password);
    const type = "access"
    const role = user.role;
    let firstLogin = user.firstLogin;
    const tokenPayload = { type , userId , role , firstLogin};
    const accessToken = jwt.sign(
        tokenPayload,
        jwt_key,
         //{ expiresIn: ONE_MINUT }   
       { expiresIn: FIFTEEN_MINUTES_IN_SECOND }    

      );
    return accessToken
}
export function genKey(id:number, password:string){
    const rawKey = id+password;
    const key = hashHmacSha256(rawKey);
    return key;
}