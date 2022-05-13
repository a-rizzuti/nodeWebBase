import logger from "@logger";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { db } from "@app";
import hashHmacSha256 from "@auth/hashing/hashing"
import * as userController from "@db/controller/UserController"
import * as tokenController from "@db/controller/auth/tokenController"
import user from "@db/model/entities/users/user.model";

export async function resetFromToken(req:Request,res:Response){
    const isValid = validationResult(req);
    if(!isValid.isEmpty()){
      res.status(400).json(isValid);
      return;
    }
    let tk = req.body.token;
    let uid = req.body.uid;
    let newPassword = req.body.newPassword;
    let trans = await db.instance.transaction();

    try{
        if(!Number(uid))throw new Error("UID isn't number");
        let hashed = hashHmacSha256(tk);
        let isTokenValid = await tokenController.isTokenValid(hashed,Number(uid), trans);
        if(!isTokenValid){
            logger.debug("[isTokenValid] [404]")
            res.status(404).send();
            await trans.rollback();
            return;
        }
        let usr = await userController.getById(Number(uid),trans);
        if(usr == null){
            throw new Error("Utente non trovato");
        }
        await userController.updatePassword(usr.name,newPassword,trans);
        await sendEmailCambioPassword(usr);
        await trans.commit();
        res.status(200).send();
        logger.debug("[isTokenValid] [200]")
        return;
        
    }catch(e){
        let msg = (e as Error).message;
        logger.error("[REST] [genResetToken] "+msg);
        await trans.rollback();
        res.status(500).send();
    }
}
async function sendEmailCambioPassword(u:user){
    
}
