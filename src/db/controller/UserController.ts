import { EuserDetailsKeys, EuserDetailsValues } from "../enums/EuserDetails";
import user  from "@db/model/entities/users/user.model";
import userDetails from "@db/model//details/users/userDetails.model"
import { Op, Transaction } from "sequelize";
import * as superAdminController from "./SuperAdminController"

import logger from "@logger";

export async function getAll(trans?:Transaction): Promise<user[]>{
  if(trans){
    return await user.findAll({transaction:trans})
  }
  return await user.findAll();
}



export async function getById(id:number, trans?:Transaction): Promise<user|null>{
  
  try{
    let ret : user | null;
    if(trans){
      ret = await user.findOne({
        where: {
          id: id
        },transaction:trans
      });
    }else{
      ret = await user.findOne({
        where: {
          id: id
        }
      });
    }
    return Promise.resolve(ret);
   
    } catch(e) {
    logger.error(`[REST] ${(e as Error).message}`);
    return Promise.resolve(null);
    }
}
export async function getByUsername(name:string,trans:Transaction): Promise<user|null>{
  
    try{
      const user_found = await user.findOne({
        where: {
          name: name
        }, transaction:trans
      });
      if(user_found == null){
        return Promise.resolve(null);
        ;
      }
     return Promise.resolve(user_found);
      } catch(e) {
      logger.error(`[REST] ${(e as Error).message}`);
      return Promise.resolve(null);
      }
}
export async function getLikeUsername(nick:string,trans:Transaction){
  try{
    let result = await user.findAll({
      where:{
        name:{
            [Op.like]:'%'+nick+'%'
        }
      },
      transaction:trans
    })
    return result;
  }catch(e){
    let msg = (e as Error).message;
    logger.error(`[DB][userController][getLikeUsername] ${msg}`);
    throw e;
  }
  
}
export async function getByEmail(email:string,trans:Transaction): Promise<user|null>{
  
  try{
    const user_found = await user.findOne({
      where: {
        email: email
      }, transaction:trans
    });
    if(!user_found){
      return Promise.resolve(null);
      ;
    }
   return Promise.resolve(user_found);
    } catch(e) {
    logger.error(`[REST] ${(e as Error).message}`);
    return Promise.resolve(null);
    }
}


export async function addUser(name: string, email:string ,password:string,role: string, transaction: Transaction): Promise<user|null> {

  const exitUser = await user.findOne({where: {name: name, deletedAt:null}});
  if(exitUser){
   //throw new Error("user name with username "+ name +" already exist!")
    return Promise.resolve(null);
  }
  try{
    const new_user = new user({
      name: name,
      email:email,
      password: password,
      active:true,
    });
    await new_user.save({transaction: transaction});
    await addRole(new_user.id, role,transaction);
    await setFirstLogin(new_user.id,EuserDetailsValues.NEVER_DID_FIRST_LOGIN,transaction);
    return Promise.resolve(new_user)
  } catch(e){
    logger.error(`[REST] ${(e as Error).message}`);
    throw e;
    
  }
}
export async function updatePassword(name: string, password:string, transaction:Transaction): Promise<user|null> {
  try{
    const exitUser = await user.findOne({where: {name: name}});
    if(!exitUser){
    
      return Promise.resolve(null);
    }
    exitUser.password = password;
    
    await exitUser.save({transaction:transaction});
    return Promise.resolve(exitUser)
  } catch(e){
    console.log(`[REST] ${(e as Error).message}`);
    return Promise.resolve(null);
  }
}


export async function updatedName(name: string,newName:string): Promise<user|null> {

  
  const exitUser = await user.findOne({where: {name: name}});
  if(!exitUser){
   
    return Promise.resolve(null);
  }
  try{
    exitUser.update({
        name:newName
    });
    await exitUser.save();
    return Promise.resolve(exitUser)
  } catch(e){
    logger.error(`[REST] ${(e as Error).message}`);
    return Promise.resolve(null);
  }
}
//user meta part
export async function addDetail(userId:number,key:string, value:string, trans:Transaction){
  try{
    const new_detail = new userDetails({
      
      user_id : userId,
      key : key,
      value : value

    });
    await new_detail.save({transaction: trans});
    return Promise.resolve(new_detail)
  }catch(e){
    logger.error("[DB] [UserController] [addDetail] "+(e as Error).message);
    throw e;
  }
}
export async function addRole(id:number,role:string,transaction: Transaction){
  try{
    const new_detail = new userDetails({
      
      user_id : id,
      key : EuserDetailsKeys.ROLE,
      value : role

    });
    await new_detail.save({transaction: transaction});
    return Promise.resolve(new_detail)
  } catch(e){
    logger.error("[DB] [addRole] "+(e as Error).message);
    throw e;
  }
}
export async function setRole(uid:number,role:string,trans:Transaction){
  try{
    let det : userDetails | null = await userDetails.findOne({where:{
      user_id:uid,
      key:EuserDetailsKeys.ROLE
    }, transaction:trans});
    if(det == null){
      let ret = await addRole(uid,role,trans);
      return ret;
    }
    det.value = role;
    await det.save({transaction:trans});
    return det;
  }catch(e){
    logger.error("[DB] [UserController] [setRole]"+(e as Error).message)
    throw e
  }
}
export async function getRole(uid:number,trans?:Transaction){
  try{
    let det : userDetails | null = null
    if(trans){
       det = await userDetails.findOne({
        where: {
          user_id:uid,
          key:EuserDetailsKeys.ROLE
        }, transaction:trans
      });
    }else{
      det = await userDetails.findOne({
        where: {
          user_id:uid,
          key:EuserDetailsKeys.ROLE
        }, 
      });
    }
   
  if(det==null){
    throw new Error("Details not found");
  }
  return Promise.resolve(det.value);  
  }catch(e){
    logger.error("[DB] "+(e as Error).message)
    throw e
  }
}
export async function  setFirstLogin(id:number,value:string,transaction: Transaction){
  try{
    let det = await userDetails.findOne({
      where: {
        user_id:id,
        key:EuserDetailsKeys.FIRST_LOGIN
      }, transaction:transaction
    });
    if(det) return det;
    const new_detail = new userDetails({
      
      user_id : id,
      key : EuserDetailsKeys.FIRST_LOGIN,
      value : value

    });
    await new_detail.save({transaction: transaction});
    return Promise.resolve(new_detail)
  } catch(e){
    logger.error("[DB] [addRole] "+(e as Error).message);
    throw e;
  }
}
export async function getFirstLogin(id:number, trans?:Transaction){
  try{
    let det : userDetails | null;
    if(trans){
      det = await userDetails.findOne({
        where: {
          user_id:id,
          key:EuserDetailsKeys.FIRST_LOGIN
        }, transaction:trans
      });
    }else{
      det = await userDetails.findOne({
        where: {
          user_id:id,
          key:EuserDetailsKeys.FIRST_LOGIN
        }
      });
    } 
   
    if(det==null){
      throw new Error("Details not found");
    }
    return Promise.resolve(det.value);  
  }catch(e){
    logger.error("[DB] "+(e as Error).message)
    throw e
  }
}
export async function getDetailsByUID(key:string, uid:number, trans?:Transaction){
  try{
    let  det : userDetails[]
    if(trans){
       det = await userDetails.findAll({
        where: {
          user_id:uid,
          key:key
        }, transaction:trans
      });
    }else{
       det = await userDetails.findAll({
        where: {
          user_id:uid,
          key:key
        }
      });
    }
   
  if(det==null){
    throw new Error("Details not found");
  }
  return Promise.resolve(det);  
  }catch(e){
    logger.error("[DB] "+(e as Error).message)
    throw e
  }
}
export async function getAllDetailsByUID(uid:number,trans:Transaction){
  try{
    const det = await userDetails.findAll({
      where: {
        user_id:uid,
      },transaction:trans});
  if(det==null){
    throw new Error("Details not found");
  }
  return Promise.resolve(det);  
  }catch(e){
    logger.error("[DB] [getAllDetailsByUID]"+(e as Error).message)
    throw e
  }
}
export async function getProfilePicture(uid:number,trans?:Transaction){
  try{

    let query : any = {where:{user_id:uid, key:EuserDetailsKeys.PICTURE}};
    if(trans) query.transaction = trans;
    let logo = await userDetails.findOne(query);
    return logo;
  }catch(e){
    logger.error("[DB] [userController] [getLogo] "+(e as Error).message)
    throw e
  }
}
export async function setProfilePicture(uid:number, value:string, trans:Transaction){
  try{ 

    let logo = await getProfilePicture(uid,trans);
    if(logo){
      await logo.destroy({transaction:trans});
      await logo.save({transaction:trans});
    }
    logo = await addDetail(uid,EuserDetailsKeys.PICTURE,value,trans);
    return logo;
  }catch(e){
    logger.error("[DB] [userController] [getLogo] "+(e as Error).message)
    throw e
  }
}


export async function isSuperAdmin(uid:number,trans?:Transaction) : Promise<Boolean>{
  try{
    let mem = await superAdminController.getByUID(uid,trans);
    if(mem)return Promise.resolve(true);
  }catch(e){
    let msg = (e as Error).message;
    if(! msg.includes("non trovato")){
      logger.error("[DB] [isSuperAdmin] "+msg);
    }
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}
