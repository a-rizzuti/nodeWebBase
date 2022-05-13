import { NextFunction, Request, Response } from 'express'
import logger from '@logger';
import { db } from '@app';
import * as SuperAdminController from 'db/controller/SuperAdminController'
import { time } from 'console';
import { getUserId } from '@auth/token/tokenValidation';
export async function SuperAdminMiddleware(req :Request, res:Response, next:NextFunction) : Promise<void>{ 
    let trans = await db.instance.transaction();
    let timestamp = Date.now();
    try {

        let userId = await getUserId(req)
        logger.info(`Entering SuperAdmin request from ${userId} - timestamp: ${timestamp}`)

        let id = Number(userId);
        let ss = await SuperAdminController.getByUID(id,trans);
        if(ss == null){
            await trans.rollback();
            res.status(401).send('User is not superadmin')
            logger.warn(` User ${userId} did not have privileges - timestamp: ${timestamp}`)

            return 
        }
        logger.info(`User ${userId} is super admin, auth completed. - timetamp: ${timestamp}`)
        await trans.rollback();
        next();
    } catch (e) {
      await trans.rollback();
      let msg = (e as Error).message;
      logger.error("[AUTH] [SuperAdminMiddleware]: "+msg)
      res.status(500).send(msg)
    }
}
