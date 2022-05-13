import { stringify } from "querystring"


import fs = require('fs');
import logger from "../../logger";
import { Transaction } from "sequelize/types";
import path = require("path");
import {mailer} from "../../app"

export class TemplateFiller{
     templatePath: string = "../../../../data/templates/";
      fillMail(file:string,tags:string[],subs:string[]){
        try{
            let data =   fs.readFileSync(file,"utf8")
            for(let i=0;i<tags.length;i++){
                let re = new RegExp(tags[i], 'g');
                data = data.replace(re,subs[i]);
            }
            let undefined_reg = new RegExp("undefined",'g');
            data = data.replace(undefined_reg,"n/a");
            return data;
        }catch(e){
            logger.error("[TemplateFiller] "+(e as Error).message)
            throw e;
        }
        


    }
    async mailCambioPassword(){

    }
    async mailRichiestaCambioPassword(toEmail:string, nickname:string, url:string){
        if(!mailer.avviato){
            logger.warn(`[REST] [ordineHelper] impossibile mandare mail per token password ${toEmail}.\n --Mailer non avviato`)
            return;
        }
        let time = new Date();
        let subs:string[] = [ nickname, url, time.toLocaleString() ]

        
        let tags:string[] = [ "<<NOME>>","<<URL>>", "<<DATA>>" ]
                         
        let WORKDIR  = `${__dirname}`;
        let pt = path.join(WORKDIR+this.templatePath+"/email/email_richiesta_cambio_password");
        let txt = this.fillMail(`${pt}/richiesta_cambio_password.txt`,tags,subs);
        let html = this.fillMail(`${pt}/richiesta_cambio_password_html.txt`,tags,subs);
        if(mailer.avviato){
            await mailer.sendMailHTML(toEmail,"Richiesta cambio password",txt,html);
        }

    }
    async mailRegistrazione(){
        
    }
    
}