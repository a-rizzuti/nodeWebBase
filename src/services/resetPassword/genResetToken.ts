import logger from "@logger";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { db } from "@app";
import * as userController from "@db/controller/UserController"
import * as tokenController from "@db/controller/auth/tokenController"
import { TemplateFiller } from "@helper/mailer/templateFiller";

export async function genResetToken(req:Request,res:Response){
    const isValid = validationResult(req);
    if(!isValid.isEmpty()){
      res.status(400).json(isValid);
      return;
    }
    let emailReq = req.body.email;
    let trans = await db.instance.transaction();
    try{
        let usr = await userController.getByEmail(emailReq,trans);
        if(usr == null){
            //non notifico la non esistenza dell'utente
            res.sendStatus(200);
            await trans.rollback();
            return;
        }
        let tk = await tokenController.addToken(usr.id,trans);
        await sendResetEmail(emailReq,usr.name,tk.value,usr.id);
        await trans.commit();
        res.status(200).json(emailReq).send();

    }catch(e){
        let msg = (e as Error).message;
        logger.error("[REST] [genResetToken] "+msg);
        await trans.rollback();
        res.sendStatus(500);
    }
}
async function sendResetEmail(email:string,name:string,token:string,id:number){
    let url : string = "";
    let localhost = "http://localhost:4200/"
    let delploy = "";
    if(`${process.env.NODE_ENV}` == "development"){
        url = localhost 
    }
    else{
        url = delploy;
    }
    url += "reset/"+token +"/"+id
    let tf = new TemplateFiller();
    await tf.mailRichiestaCambioPassword(email,name,url)

}