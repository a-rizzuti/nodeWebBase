import { validationResult } from 'express-validator'
import { Request, Response } from 'express'
import logger from '../../../logger';


//toDO creare classe per aggiungere e prendere dal body
export async function genPassword(req: Request, res: Response): Promise<void> {
    const isValid = validationResult(req);
    if(!isValid.isEmpty()){
      res.status(400).json(isValid);
      return;
    }
    try{
        let response:any;
       
        res.json(response).status(200);
        res.send();
        return Promise.resolve();
    }catch(e){
        logger.error("[REST] "+(e as Error).message)
        res.sendStatus(500);
        return Promise.resolve();

    }
    return;
    
    
}


