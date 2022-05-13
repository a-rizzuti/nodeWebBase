import { Request, Response } from 'express'
import * as settingController from '@db/controller/app/appSettingsController'

import {db} from "@app"
import logger from '@logger';
import appSetting from '@db/model/entities/app/appSettings.model';
export async function editSetting(req:Request,res:Response){
    let trans = await db.instance.transaction();
    try{
        
       
        //console.log(JSON.stringify(req.body));
        if(req.body.error){
            throw new Error(req.body.error);
        }
        let reqBody : appSetting = req.body as appSetting;
        //console.log(reqBody)
        logger.debug(`[REST] [editSetting]  key:${reqBody.key}`)
        let exist = await settingController.getByKey(reqBody.key,trans);
        if(exist == null){
            res.status(404).send(`Setting con key ${reqBody.key} inesistente`)
        }

        await settingController.editSetting(reqBody.key,reqBody.value,reqBody.descrizione,trans)
        logger.debug(`[REST] [editSetting]  key:${reqBody.key} UPDATED`)

        await trans.commit();
        res.status(200).send();
    }catch(e){
        await trans.rollback();
        let msg = (e as Error).message;
        logger.error("[REST] [SETTINGS] [editSetting] "+msg )

        let error = { error: msg}
        res.status(500).json(error).send();
    }
}