import logger from "../logger";
import * as UserController from "../db/controller/UserController"
import * as crypt from "../auth/bcrypt/crypting"
import * as superAdminController from "../db/controller/SuperAdminController"

import {EuserDetailsValues} from "../db/enums/EuserDetails";
import {db,mailer} from "../app"

export async function genAdmin(){
    let trans = await db.instance.transaction();
    try{
        let admin = `${process.env.ADMIN_NICKNAME}`
        let adminEmail = `${process.env.ADMIN_EMAIL}`;
        let adminExist = await UserController.getByUsername(admin,trans);
        if(adminExist){
            logger.info(`[genApp] utente admin già esistente`);
            await trans.commit();
            return;
        }
        let adminPassword = `${process.env.ADMIN_DEFAULT_PASSWORD}`;
        let id = await crypt.addUser(admin, adminEmail,adminPassword,EuserDetailsValues.SUPERADMIN, trans);
        let subject:string = "utenza creata";
        let text = `La tua utenza alla piattaforma igp è stata creata.\n - email:${admin}\n -password:${adminPassword}\nRicordati di cambiare la password al primo accesso.`
        await UserController.setFirstLogin(id,EuserDetailsValues.NEVER_DID_FIRST_LOGIN,trans);
        

       
        if(mailer.avviato){
            await mailer.sendMail(adminEmail,subject,text);
        }
        await trans.commit();
    }catch(e){
        await trans.rollback();
        logger.error(`${(e as Error).message}`)
        throw e;
    }
}