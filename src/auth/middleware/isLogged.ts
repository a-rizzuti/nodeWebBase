import { NextFunction, Request, Response } from 'express'
import logger from '@logger';

import { verifyAuthCookies } from './verifyCookiesMiddleware';
export async function isLoggedMiddleware(req :Request, res:Response, next:NextFunction) : Promise<void>{ 
    let timestamp = Date.now();
    logger.info(`[AUTH] [MIDDLEWARE] [${timestamp}]Checking if user is logged from token`)
    try{
      //let at = await authenticationMiddleware(req,res);
      let at = await verifyAuthCookies(req,res);
      logger.debug(`[AUTH] [MIDDLEWARE] [isLogged] at return ${at}`)
      if(at<0){
        logger.warn(`[AUTH] [MIDDLEWARE] [${timestamp}]at=${at}`)
        res.status(401).send("User not found");
        return;
      }
      next();
    }catch(e){
      let msg = (e as Error).message;
      logger.warn(`[AUTH] [MIDDLEWARE] [${timestamp} ] catch\n${msg}`)

      if(msg.includes("expired")){
  
        res.status(401).send(msg);
        return;
      }
      if(msg.includes('malformed')){
          res.status(401).send(msg);
          return
      }
      if(msg.includes('403')){
        res.status(403).send(msg);
        return;
      }
      res.sendStatus(500);
      return;
    }
    logger.info(`[AUTH] [MIDDLEWARE] [${timestamp} ] STATUS: PASS`)

   
    
}

