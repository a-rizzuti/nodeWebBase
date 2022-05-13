import token  from "@db/model/entities/tokens/token.model";
import {tokenGenerator} from "@helper/tokenGenerator"
import {db} from "@app"
import { Sequelize, Transaction } from "sequelize/types";
import logger from "@logger";
import Token from "@objects/Token";
export async function getAll(): Promise<token[]>{
  const tokens = await token.findAll();
  return tokens;
}



export async function getById(id:number): Promise<token|null>{
  
  try{
    const token_found = await token.findOne({
      where: {
        id: id
      }
    });
    if(!token_found){
      return Promise.resolve(null);
      ;
    }
   return Promise.resolve(token_found);
    } catch(e) {
     logger.error(`[REST] ${(e as Error).message}`);
    return Promise.resolve(null);
    }
}
export async function getByUID(uid:number): Promise<token|null>{
  
    try{
      const token_found = await token.findOne({
        where: {
          uid: uid
        }
      });
      if(!token_found){
        return Promise.resolve(null);
        ;
      }
     return Promise.resolve(token_found);
      } catch(e) {
        logger.error(`[REST] ${(e as Error).message}`);
      return Promise.resolve(null);
      }
  }
export async function getByValue(value:string, trans?:Transaction){
  try{
    let ret : token | null;
    if(trans){
      ret = await token.findOne({
        where: {
          value: value
        },transaction:trans
      });
    }else{
      ret = await token.findOne({
        where: {
          value: value
        }
      });
    }
  
    
     return Promise.resolve(ret);
    } catch(e) {
      logger.error(`[REST] ${(e as Error).message}`);
      return Promise.resolve(null);
    }
}
export async function addToken( uid:number, trans:Transaction): Promise<Token> {

  let seq : Sequelize = db.instance;
  const existToken = await token.findOne({where: {uid: uid}});
  try{
    if(existToken){
      await existToken.destroy({transaction:trans});
    }
    let tk :Token= await (new tokenGenerator()).getToken();
    const new_token = new token({
      uid:uid,
      value: tk.hashed,
      genAt: tk.generated.toString(),
      
      //exp: tk.validUntil exp is disabled
    });
    await new_token.save({transaction:trans});
    return Promise.resolve(tk)
  } catch(e){
      logger.error(`[REST] ${(e as Error).message}`);
      await trans.rollback();
      throw e;
  }
}


        
export async function renewByUid(uid:number) : Promise<token|null>{
    const existToken = await token.findOne({where: {uid: uid}});
    if(!existToken){
        return Promise.resolve(null);
    }
    try{  
        let tk = await (new tokenGenerator()).getTokenWihtValue(existToken.value)
        existToken.update({
            genAt: tk.generated,
            exp: tk.validUntil});
        await  existToken.save();
        return Promise.resolve( existToken )
    } catch(e){
        let msg = (e as Error).message;
        logger.error(`[REST] ${msg}`);
        return Promise.resolve(null);
    }
}
export async function renewByToken(uid:number,oldValue:string) : Promise<token|null>{
  const existToken = await token.findOne({where: {uid: uid, value:oldValue}});
  if(!existToken){
      return Promise.resolve(null);
  }
  try{  
      let tk = await (new tokenGenerator()).getTokenWihtValue(existToken.value)
      existToken.update({
          genAt: tk.generated,
          //exp: tk.validUntil exp is disabled
        });
      await  existToken.save();
      return Promise.resolve( existToken )
  } catch(e){
    let msg = (e as Error).message;
    logger.error(`[REST] ${msg}`);
    return Promise.resolve(null)
  }
}
export async function isTokenValid(value:string, uid:number,trans:Transaction): Promise<Boolean>{
  const existToken = await token.findOne({where: {uid: uid, value:value},transaction:trans});
  if(!existToken){
      return Promise.resolve(false);
  }
  try{ 
    let now = Date.now();
    let exp = existToken.exp;
    return Promise.resolve((now-exp>0))

  }catch(e){
    let msg = (e as Error).message;
    logger.error(`[REST] ${msg}`);
    return Promise.resolve(false)
  }


}

