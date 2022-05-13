import user   from "@db/model/entities/users/user.model"
import * as userController from "@db/controller/UserController";
import { Transaction } from "sequelize/types";
import { EuserDetailsValues } from "@db/enums/EuserDetails";

import conf from "@config";

import logger from "@logger";


export default class User{

    username: string;
    password: string;
    userId:number;
    picture!:string;
    role?: string;
    firstLogin ?: boolean;
    constructor(model:user, ){
        this.userId = model.id;
        this.username = model.name;
        this.password = model.password;
        

    }
    
    setRole(role:string){
        this.role = role;
    }
    setFirstLogin(firstLogin:boolean){
        this.firstLogin= firstLogin;
    }
}
export async function buildUser(model:user, hidePassword:boolean, trans?:Transaction){
    let ret = new User(model);
    if(trans){
        ret.role =  await userController.getRole(model.id,trans);
        ret.password= model.password;
        if(hidePassword) ret.password = "";
        ret.firstLogin = (await userController.getFirstLogin(model.id,trans)) === EuserDetailsValues.NEVER_DID_FIRST_LOGIN;
        ret.picture = await getPicture(ret.userId,trans)
        return ret;
    }
    ret.password = model.password;
    if(hidePassword) ret.password = "";

    ret.role = await userController.getRole(model.id);
    ret.firstLogin = await userController.getFirstLogin(model.id) === EuserDetailsValues.NEVER_DID_FIRST_LOGIN;
    ret.picture = await getPicture(ret.userId);
    return ret;
    
}
async function getPicture(n:number,trans?:Transaction ) : Promise<string>{
    let pic = await userController.getProfilePicture(n,trans)
    if(pic){
        logger.debug(`[getPicture] picture exist!`)

    }
    let ret =  pic? pic.value:conf.DEFAULT_IMG_UTENTE;
    logger.debug(`[getPicture] user:${n} picture: ${ret}`)
    return ret;
}
