import { validationResult } from 'express-validator'
import { Request, Response } from 'express'
import * as userController from "../../../db/controller/UserController"
import logger from '../../../logger';
import * as crypt from "../../../auth/bcrypt/crypting"
import { db } from '../../../app'

export async function setPassword(req: Request, res: Response): Promise<void> {
    logger.info(`[REST] [Handling] [admin/setPassword] `);
    const isValid = validationResult(req);
    if(!isValid.isEmpty()){
      res.status(400).json(isValid);
      return;
    }
    
    const { username, newPassword} = req.body;
    let trans = await db.instance.transaction();

    try{
        const exitUser = await userController.getByUsername(username,trans);
        if(exitUser == null){
            //console.log("user not found");
            await trans.rollback();
            res.sendStatus(404);
            return;
        }
        let update = await crypt.setPassword(username,newPassword,trans)

        if(!update){
            res.sendStatus(400);
            await trans.rollback();
            logger.info(`[REST] [COMPLETED] [ NOT OK ] [admin/setPassword] `);

            return;
        }
        logger.info(`[REST] [COMPLETED] [ OK ] [admin/setPassword] `);
        res.status(200).send();
        await trans.commit();
        return;
    
    } catch(e){
      logger.error(`[REST] [admin/setPassword] ${(e as Error).message}`);
      await trans.rollback();
      res.sendStatus(500);
    }
  }