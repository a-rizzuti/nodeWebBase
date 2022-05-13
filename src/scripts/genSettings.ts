import logger from "../logger";
import * as settingController from "@db/controller/app/appSettingsController"
import {db,mailer} from "../app"
import settings from "../assets/settings/settings.json"


export async function genSettings(){
    logger.info("[genSettings] init process...")

    let trans = await db.instance.transaction();
    try{
       
        for(let set of settings){
            let s = await settingController.getByKey(set.key,trans);
            if(s == null){
                let added = await settingController.addSetting(set.key,set.value,set.descrizione,trans)
            }
        }

        await trans.commit();
        logger.info("[genSettings] ended process.")

    }catch(e){
        await trans.rollback();
        logger.error(`${(e as Error).message}`)
        throw e;
    }
}
