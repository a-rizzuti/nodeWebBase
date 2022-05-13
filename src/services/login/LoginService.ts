import { validationResult } from 'express-validator'
import { Request, Response } from 'express'
import * as userController from "@db/controller/UserController"
import logger from '@logger';
import {checkPassword} from "@auth/bcrypt/crypting"
import  { buildUser } from '@objects/users/user';
import { EuserDetailsValues } from '@db/enums/EuserDetails';
import {db} from "@app"
import { genAccessToken } from '@auth/token/genAccessToken';
import { genRefreshToken } from '@auth/token/genRefershToken';
import StringCrypt from '@auth/cookies/CookieCrypt';
export async function login(req: Request, res: Response): Promise<void> {
    const isValid = validationResult(req);
    if(!isValid.isEmpty()){
      res.status(400).json(isValid);
      return;
    }
    let time = Date.now();
    logger.info("[REST][login] ["+time+"] handling login request...");
    const { username, password} = req.body;
    let trans = await db.instance.transaction();
    try{
        const exitUser = await userController.getByUsername(username,trans);
        if(exitUser == null){
            res.sendStatus(404);
            await trans.rollback();
            logger.info("[REST][login] ["+time+"] 404")
            return;
        }
        
        let passwordCorrect : boolean = await checkPassword(password, exitUser.password);
        if(!passwordCorrect){
            logger.info("[REST][login] ["+time+"] 400")
            await trans.rollback();
            res.sendStatus(404);
            return
        }
       
        
        let retUser = await buildUser(exitUser,false,trans);
        await userController.setFirstLogin(exitUser.id,EuserDetailsValues.HAS_DONE_FIRST_LOGIN,trans);
        let response : any = {};
        response.userId = retUser.userId;
        response.role = retUser.role;
        response.username = retUser.username;
        response.accessToken = genAccessToken(retUser); 
        response.refreshToken = genRefreshToken(retUser);;

        let millis = 5*60*60*1000
        console.log(millis)
        let accessCrypt = StringCrypt.encrypt(response.accessToken);
        let refreshCrypt = StringCrypt.encrypt(response.refreshToken);
        res.cookie('accessToken', accessCrypt ),
        res.cookie('refreshToken', refreshCrypt,{maxAge:millis})
        res.status(200).json(response);
        res.send();
        logger.info("[REST][login] ["+time+"] 200")
        await trans.commit();
        return;
    
    } catch(e){
      logger.error(`[REST] ${(e as Error).message}`);
      await trans.rollback();
      res.sendStatus(400);
    }
  }