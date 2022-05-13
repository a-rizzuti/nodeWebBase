import appSetting from "@db/model/entities/app/appSettings.model";
import logger from "@logger";
import { Transaction } from "sequelize/types";

export async function getAll(trans?:Transaction){
    try{
        if(trans){
            return appSetting.findAll({transaction:trans});
        }
        return appSetting.findAll()
    }catch(e){
        logger.error(`[DB] [appSettingController] [getAll] ${(e as Error).message}`)
        throw e;
    }
}

export async function getByKey(key:string, trans:Transaction){
    try{
        let query = { 
            where:{
                key:key
            },
            transaction:trans
        }
        return await appSetting.findOne(query)
    }catch(e){
        logger.error(`[DB] [appSettingController] [getByKey] ${(e as Error).message}`)
        throw e;
    }

}

export async function addSetting(key:string,value:boolean,descrizione:string, trans:Transaction){
    try{
        let newSett = new appSetting({
            key:key,
            value:value,
            descrizione:descrizione
        })
        await newSett.save({transaction:trans})
        return newSett;
    }catch(e){
        logger.error(`[DB] [appSettingController] [addSetting] ${(e as Error).message}`)
        throw e;
    }

}
export async function editSetting(key:string,value:boolean,descrizione:string,trans:Transaction){
    try{
        let toEdit = await getByKey(key,trans);
        if(toEdit == null){
            throw new Error(`Impossibile trovare setting da modificare con key: ${key}`)
        }
        toEdit.key=key;
        toEdit.value=value;
        toEdit.descrizione=descrizione
        
        await toEdit.save({transaction:trans})
        return toEdit;
    }catch(e){
        logger.error(`[DB] [appSettingController] [editSetting] ${(e as Error).message}`)
        throw e;
    }


}

export async function destroy(key:string,trans:Transaction){
    try{
        let toDestroy = await getByKey(key,trans);
        if(toDestroy == null) return;
        await toDestroy.destroy({transaction:trans});
        await toDestroy.save({transaction:trans})
    }catch(e){
        logger.error(`[DB] [appSettingController] [destroy] ${(e as Error).message}`)
        throw e;
    }
}