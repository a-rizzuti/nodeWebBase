import { validationResult } from 'express-validator'
import { Request, Response } from 'express'
import logger from '@logger';
import User, { buildUser } from '@objects/users/user';
import {db} from "@app"
import user from '@db/model/entities/users/user.model';
import * as userController from "@db/controller/UserController"
import { getUserId } from '@auth/token/tokenValidation';


//toDO creare classe per aggiungere e prendere dal body
export async function getPersonalInfo(req: Request, res: Response): Promise<void> {
    const isValid = validationResult(req);
    if(!isValid.isEmpty()){
      //res.status(400).json(isValid);
      return;
    }
 
    let trans = await db.instance.transaction();
    try{
        let userId = await getUserId(req);
        let usr = await userController.getById(userId,trans);
        if(usr == null){
            res.status(404).send("Impossibile trovare utente associato al token");
            await trans.rollback();
            return;
        }
        let ret = await buildUser(usr,true,trans);
        

        
        //logger.debug("[REST] [getPersonalInfo] sending back:\n"+JSON.stringify(ret,null,2)+"\n ******end of array*****")
        
        res.json(ret);
        await trans.commit();
        return Promise.resolve();

    }catch(error){
        logger.error("[REST] [getPersonalInfo]"+(error as Error).message)
        await trans.rollback();
        res.sendStatus(500);
        return Promise.resolve();

    }
    return;  
}