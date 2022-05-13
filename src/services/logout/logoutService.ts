import { validationResult } from 'express-validator'
import { Request, Response } from 'express'
import logger from '@logger';
export async function logout(req: Request, res: Response): Promise<void> {
    const isValid = validationResult(req);
    if(!isValid.isEmpty()){
      res.status(400).json(isValid);
      return;
    }
    let time = Date.now();
    logger.info("[REST][login] ["+time+"] handling logout request...");
    const { username, password} = req.body;
   
    try{
        
        res.clearCookie('accesToken');
        res.clearCookie('refreshToken');
        
        res.status(200);
        res.send();
        logger.info("[REST][logout] ["+time+"] 200")
       
        return;
    
    } catch(e){
      logger.error(`[REST] [logout] ${(e as Error).message}`);
      res.sendStatus(400);
    }
  }