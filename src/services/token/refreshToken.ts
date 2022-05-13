import { validationResult } from 'express-validator'
import { Request, Response } from 'express'
import jwt from "jsonwebtoken"
import * as userController from "@db/controller/UserController"
import { genAccessToken, genKey } from '@auth/token/genAccessToken';
import User from '@objects/users/user';
import logger from '@logger';
export async function refreshToken(req:Request, res:Response){
    const refreshToken = req.body.refreshToken;
 
    try {
        logger.debug(`[AUTH] [refreshToken] received token: ${refreshToken}`)
        let jwt_key = `${process.env.JWT_SECRET_KEY}`
        const tokenPayload = jwt.verify(refreshToken, jwt_key);
        let payload = tokenPayload as  jwt.JwtPayload;
        if (payload.type !== 'refresh') {
            throw new Error('wrong token type');
        }
        const userId = payload.userId;
        const userInDb = await userController.getById(userId);
        if(userInDb == null){
            throw new Error("Utente non trovato");
        }
        const password = userInDb.password;
        const keyToCompare = genKey(userId, password);
        if (keyToCompare !== payload.key) {
            throw new Error('password changed');
        }
        let usrObj = new User(userInDb);

        const newAccessToken = genAccessToken(usrObj);
        res.status(200).json(newAccessToken).send();
        logger.debug(`[AUTH] [refreshToken] generated new access token`)
    } catch (error) {
        let msg = (error as Error).message
        logger.error(`[AUTH] [refreshToken]  ${msg}`)
        res.status(401).send(msg);
    }
}