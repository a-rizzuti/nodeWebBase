import { db } from "@app";
import path from "path";
import fs from 'fs'
import logger from "@logger";
import { Transaction } from "sequelize/types";


export async function backAllTables(trans:Transaction){
    try{
        let baks = __dirname+`../../../../../data/backs`
        let pb = path.join(__dirname+`../../../../data/backs`)
        let ext = '.json'
        let today = new Date();
       
        let newBakDirectory = path.join(baks + `/${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`)
        
        if(!fs.existsSync(newBakDirectory)){
            fs.mkdirSync(newBakDirectory, '0744')
            logger.info(`[REST][backAllTables] creata cartella ${newBakDirectory}`)

        }
        let models = db.instance.models;
        for(let m of Object.keys(models)){
            let values = await models[m].findAll({transaction:trans})
            let toPrint = `[\n`
            for(let i=0;i<values.length;i++){
                toPrint = toPrint + JSON.stringify(values[i].toJSON(),null,2) ;
                if(i != ( values.length - 1 ) ) 
                    toPrint += ',\n'
    
            }
            toPrint += '\n]'
            fs.writeFileSync(`${newBakDirectory}/${m}${ext}`,toPrint);
            logger.info(`[DBCONTROLLER][tablesBackup] table: ${m} - done`)
    
        }
    
    }catch(e){
        logger.error(`[DB][dbController][backAllTrables] ${(e as Error).message}`)
    }
   
}
