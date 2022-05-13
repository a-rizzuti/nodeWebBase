import { db } from "@app";
import logger from "@logger";
import { Request, Response } from "express";
import * as dbController from '@db/controller/app/dbController'

export async function dropAllTables(req:Request,res:Response){
    let trans = await db.instance.transaction();
    try{
        if(req.body.backup){
            logger.info(`[DBCONTROLLER][dropAllTables] starting backup `)
            let backup = await dbController.backAllTables(trans)
        }
        await db.dropTables();
       
        
        res.status(200).send();
        await trans.commit()
    }catch(e){
        await trans.rollback()
        let err = e as Error;
        logger.error(`[REST] [dropAllTables] + ${err.message}`);
        res.status(500).send(err.message)
    }
}