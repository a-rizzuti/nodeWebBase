import superAdmin from "@db/model/entities/users/superAdmin.model";
import logger from "@logger";
import { Transaction } from "sequelize/types";


export async function gellAll(trans?:Transaction){
    if(trans){
        return await superAdmin.findAll({transaction:trans});
    }
    return await superAdmin.findAll();
}
export async function getByUID(uid:number,trans?:Transaction){
    try{
        let ret;
        if(trans){
            ret= await superAdmin.findOne({where:{
                user_id:uid
            }, transaction:trans})
        }else{
            ret= await superAdmin.findOne({where:{user_id:uid}});
        }
        if(ret == null){
            throw new Error("superAdmin non trovato")
        }
        return ret;
    }catch(e){
        logger.error("[DB] [superAdminController] [getByUID] "+ (e as Error).message);
        throw e;
    }
    
}
export async function addByUID(uid:number, gradoId:number,trans?:Transaction){
    try{
        let sa;
        sa = new superAdmin({user_id:uid, grado_id:gradoId})
        if(trans){
            await sa.save({transaction:trans})
            return sa;
        }
        await sa.save();
        return sa;
    }catch(e){
        logger.error("[DB] [superAdminController] [addByUID] "+ (e as Error).message);
        throw e;
    }
}
export async function deleteByUID(uid:number, trans?:Transaction){
    try{
        if(trans){
            let sa = await getByUID(uid,trans);
            sa.destroy({transaction:trans})
            return;
        }
        let sa = await getByUID(uid);
        sa.destroy();
        return;
    }catch(e){
        logger.error("[DB] [superAdminController] [deleteByUID] "+ (e as Error).message);
        throw e;
    }
}