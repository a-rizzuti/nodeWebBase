import { Request, Response } from 'express'
import jwt from "jsonwebtoken"

import logger from '@logger';
import { db } from '@app';
import { getCookiesTokens, isRefreshTokenValid, isTokenValid } from '../token/tokenValidation'

 /**
     * I prendo il cookie di sessione
     * II prendo il cookie di refresh
     * III se il cookie di sessione è scaduto controllo il cookie di refresh e aggiorno il cookie di sessione
     * 
     * prendo i cookie
     * X -> sessione
     * Y -> refresh
     * res.cookies.{X, Y}
     * se valido X -> avanti
     * se non valido ma valido Y -> Aggiorno X (res.cookie(#nome#, valore, opts) )
     * se non valido Y e non valido X -> Redirect a Login
**/
interface tokenValidation{
  valid:boolean;
  payload?: jwt.JwtPayload;
}
export async function verifyAuthCookies(req :Request, res:Response) : Promise<Number>{ // new
    let tks = getCookiesTokens(req);
    let accessToken = tks[0]
    //console.log(accessToken.length);
    let refreshToken = tks[1]
    //console.log(tks)
    logger.debug(`[AUTH] [verifyAuthCookies] are tokens equals? ${accessToken == refreshToken}`)
    if(accessToken == undefined || refreshToken == undefined){
      throw new Error("403 - No Auth Cookies provided")
    }
    let ret = -1;
    let trans = await db.instance.transaction();
    try {
        const JWT_KEY = `${process.env.JWT_SECRET_KEY}`
        logger.debug("[AUTH] inizio il controllo del token");
        //let tokenPayload : string | jwt.JwtPayload=  '';

        let checkAccess = isTokenValid(accessToken,JWT_KEY);
        if(checkAccess.valid){
          ret = checkAccess.payload?.userId;
        }else{
          let checkRefresh =  await isRefreshTokenValid(refreshToken,JWT_KEY);
          if(!checkRefresh.isRefreshValid){
            logger.debug('[AUTH] refresh  is also invalid, returing -1')
            
            await trans.rollback();
            return -1;
          } 
          let newAccess = `${checkRefresh.refreshed}`;
          res.cookie('accessToken', newAccess)
          logger.debug(`[AUTH][verifyAuthCookies] are token equals after refresh? ${newAccess == refreshToken}`)
          logger.debug('[AUTH] Access token updated!')
          ret = checkRefresh.uid as number;
        }
       
        
    
        const userId =   ret     
        if(!Number(userId)){
          throw new Error(`userId non numerico in payload [${userId}]`)
        }    
        
        let id = Number(userId);
        await trans.rollback();
        return Promise.resolve(id);

    } catch (e) {
      await trans.rollback();
      let msg = (e as Error).message;
      logger.warn("[AUTH] token:"+accessToken+"\nmessage:"+msg)
      throw e;
    }
    return Promise.resolve(-1);
  }
