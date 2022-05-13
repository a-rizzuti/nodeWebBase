import bcrypt from "bcrypt";
import { EuserDetailsKeys } from "db/enums/EuserDetails";
import * as userController from "@db/controller/UserController"
import user from "@db/model/entities/users/user.model";
import logger from "../../logger";
import { Transaction } from "sequelize/types";
class Crypting{
  constructor(){
      
  }
  async newUser( name:string,email:string, plainTextPassword:string,role:string, transaction:Transaction)  {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    
    let  hash= await bcrypt.hashSync(plainTextPassword, salt);
    try{ 
      let user = await userController.addUser(name,email,hash,role,transaction);
      if (user != null) return Number(user.id);
      return -1;
      
      
    }catch(error){
      logger.error("[DB] "+(error as Error).message)
      return -1;
    }
    
     

    }
   async isMatch( name:string, plainTextPassword:string,trans:Transaction) {
      let found = await userController.getByUsername(name,trans);
      if (!(found instanceof user)){
        logger.debug("found is not instanceof user")
        return Promise.resolve(false);
      }
    
      let found_user = found as user;
      logger.debug("Found user:"+ found_user.name)
      let found_password = found_user.password;
      let result = await bcrypt.compare(plainTextPassword, found_password);
      return Promise.resolve(result);

   }
   async changePassword(name:string, oldPassword:string, newPassword:string, transaction:Transaction) {
      let found = await userController.getByUsername(name,transaction);
      if (!(found instanceof user)){
        logger.debug("found is not instanceof user")
        return Promise.resolve(false);
      }
      let match = await bcrypt.compare(oldPassword, found.password);
      if(match){
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        let  hash= await bcrypt.hashSync(newPassword, salt);
        let updated = await userController.updatePassword(name,hash, transaction);
       // logger.debug(updated);
        return updated;
      }
      return null;

   }

    async setPassword(name:string, newPassword:string, transaction:Transaction){
        let found = await userController.getByUsername(name,transaction);
        if (!(found instanceof user)){
          logger.debug("found is not instanceof user")
          return Promise.resolve(false);
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        let  hash= await bcrypt.hashSync(newPassword, salt);
        let updated = await userController.updatePassword(name,hash, transaction);
        logger.debug(updated);
        return updated;
          
      

    }
   

  
 
}
export async function checkPassword(input:string, hash:string){
  let result = await bcrypt.compare(input, hash)
  return result;

}
export async function addUser(name:string ,email:string, password:string,role:string, transaction: Transaction){
    let crp = new Crypting();
    return await crp.newUser(name,email,password, role,transaction);
    //logger.debug( await userController.getAll());
    
    
}
export async function getUser(name:string, password:string, trans:Transaction){
  let crp = new Crypting();
  if(await crp.isMatch(name,password,trans)){
    logger.debug("user:"+name+" password correct" );
  }else{
   logger.debug("user:"+name+" password is not:"+password)
  }
  
}
export async function changePassword(name:string, old:string, newPassword:string, transaction:Transaction ): Promise<Boolean>{
  let crp = new Crypting();
  if(await crp.changePassword(name,old,newPassword, transaction)){
    logger.info("user:"+name+" password updated" );
    return Promise.resolve(true);
  }else{
    logger.info("user:"+name+ "password not updated")
    return Promise.resolve(false);

  }
}

export async function setPassword(name:string, newPassword:string, transaction:Transaction ): Promise<Boolean>{
  let crp = new Crypting();
  if(await crp.setPassword(name,newPassword, transaction)){
    logger.info("user:"+name+" password updated" );
    return Promise.resolve(true);
  }else{
    logger.info("user:"+name+ " password not updated")
    return Promise.resolve(false);

  }
}


