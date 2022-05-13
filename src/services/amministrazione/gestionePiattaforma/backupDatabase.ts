import { db } from "@app";
import logger from "@logger";
import { Request, Response } from "express";
import * as dbController from '@db/controller/app/dbController'

export async function backupDatabase(req:Request,res:Response){
    let trans = await db.instance.transaction();
    try{
        logger.info(`[DBCONTROLLER][tablesBackup] starting backup `)
        let backup = await dbController.backAllTables(trans)
        
        res.status(200).send();
        await trans.rollback()
    }catch(e){
        await trans.rollback()
        let err = e as Error;
        logger.error(`[REST] [backupDatabase] + ${err.message}`);
        res.status(500).send(err.message)
    }
}