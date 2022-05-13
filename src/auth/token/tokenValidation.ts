import { Request, Response } from 'express'
import jwt, { Jwt } from "jsonwebtoken"
import * as userController from "@db/controller/UserController"
import { genAccessToken, genKey } from '@auth/token/genAccessToken';
import User, { buildUser } from '@objects/users/user';
import logger from '@logger';
import StringCrypt from '@auth/cookies/CookieCrypt';
import { Transaction } from 'sequelize/types';
import { access } from 'fs';
import { request } from 'http';

interface tokenValidation{
    valid:boolean;
    payload?: jwt.JwtPayload;
    refreshed?:string;
    errorMessage?:string;
}
interface accessTokenRefresh{
    isRefreshValid:boolean;
    refreshed? :string;
    uid?:number;

    error? :string
}
export  function isTokenValid(tk:string, key:string){
    let ret : tokenValidation = {} as tokenValidation;
    try{
      
      let valid = jwt.verify(tk, key)
      logger.debug('[AUTH] [isTokenValid] true')
      ret.valid = true;
      ret.payload = valid as jwt.JwtPayload;
      ret.payload.userId;
      return ret;
    }catch(e){
      logger.debug('[AUTH] [isTokenValid] false')
      ret.valid = false;
      return ret;
    }
  }
  export async function isRefreshTokenValid(tk:string, key:string){
        let ret : accessTokenRefresh = {} as accessTokenRefresh;

        try{
            const tokenPayload = jwt.verify(tk, key);
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
            ret.isRefreshValid = true;
            ret.refreshed = StringCrypt.encrypt(newAccessToken);
            ret.uid =  usrObj.userId
            return ret;

        }catch(e){
            let err = (e as Error);
            ret.isRefreshValid =false;
            ret.error = err.message;
            logger.warn(`[AUTH] isRefreshTokenValid err: ${ret.error}`)
            return ret;
        }
  }
  export function getRefreshToken(req:Request){
    let tkEncrypted = req.cookies.refreshToken;
    return StringCrypt.decrypt(tkEncrypted)
  }
  export function getToken(req:Request){
      //console.log(req)
      let tkCypted = req.cookies.accessToken;
      //console.log('cookies:',JSON.stringify(req.cookies,null,2))
      //return `${req.headers.token}` + ""; 
  
      return StringCrypt.decrypt(tkCypted)
    
  }
  export function getCookiesTokens(req:Request){
    //let {accessToken, refreshToken} = req.cookies;
    logger.debug(`[tokenValidation] are token equals before decrypt? ${req.cookies.accessToken == req.cookies.refreshToken}`)
    if(req.cookies.accessToken == undefined || req.cookies.refreshToken == undefined){
      logger.debug(`[tokenValidation] at leat one token is undefined`)
      throw new Error('403 - missing auth cookies')
    }
    let accessToken = StringCrypt.decrypt(req.cookies.accessToken);
    let refreshToken = StringCrypt.decrypt(req.cookies.refreshToken);

    logger.debug(` [tokenValidation] are tokens equals after decrypt? ${accessToken == refreshToken}`)
    return [accessToken,refreshToken];
  }
  export async function getUserId(req:Request){
        const accessToken = getToken(req);
        const JWT_KEY = `${process.env.JWT_SECRET_KEY}`
        logger.debug("[AUTH] inizio il controllo del token");
        const tokenPayload : string | jwt.JwtPayload= jwt.verify(accessToken, JWT_KEY);
        let payload = tokenPayload as jwt.JwtPayload;
        logger.debug("[AUTH] payload:"+JSON.stringify(payload,null,2)+"/n***end of payload***");
        const userId = payload.userId;       
        if(!Number(userId)){
          throw new Error(`userId non numerico in payload [${userId}]`)
        }   
        return userId; 
    }
  export function getUserIdSync(req:Request){
    const accessToken = getToken(req);
    const JWT_KEY = `${process.env.JWT_SECRET_KEY}`
    logger.debug("[AUTH] inizio il controllo del token");
    const tokenPayload : string | jwt.JwtPayload= jwt.verify(accessToken, JWT_KEY);
    let payload = tokenPayload as jwt.JwtPayload;
    logger.debug("[AUTH] payload:"+JSON.stringify(payload,null,2)+"/n***end of payload***");
    const userId = payload.userId;       
    if(!Number(userId)){
      throw new Error(`userId non numerico in payload [${userId}]`)
    }   
    return userId; 
  }
  export async function getRoleFromRequest(req:Request, trans?:Transaction){
    let userId = await getUserId(req);
    throw new Error('Metodo non ancora implementato')
  }
  export async function buildNewAccessToken(payload : jwt.JwtPayload, trans:Transaction){
    let usr = await userController.getById(payload.userId,trans);
    if(usr == null) throw new Error(`Impossibile trovare utente associato al payload`);
    let retUser = await buildUser(usr,false,trans);
    let acc = genAccessToken(retUser); 
    return StringCrypt.encrypt(acc)
  }