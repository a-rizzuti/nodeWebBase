import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import * as settingController from '@db/controller/app/appSettingsController'
import {db} from "@app"
import logger from '@logger';
import { AppSetting } from '@objects/app/AppSetting'

export async function getAllSettings(req:Request,res:Response){
    let trans = await db.instance.transaction();
    try{
      
        if(req.body.error){
            throw new Error(req.body.error);
        }
       
        let sets =  await settingController.getAll(trans);
        let ret: AppSetting[] = [];
        for(let x of sets){
            ret.push({ key: x.key, value:x.value, descrizione:x.descrizione});
        }
        
        res.json(ret);
       
        await trans.commit();
        return;
    }catch(e){
        let msg = (e as Error).message;
        
        logger.error("[REST] [SETTINGS] [getAllSettings] "+msg )
        await trans.rollback();

        let error = { error: msg}
        res.status(500).json(msg).send();
        return;
    }
}