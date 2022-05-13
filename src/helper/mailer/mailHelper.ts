import logger from '../../logger';
import nodemailer, { Transporter } from 'nodemailer';
import conf from '@config'

export class mailHelper {
   
   //possibile evolutiva: aggiunta di tabella mail in db
    avviato!:boolean;
    transporter !: Transporter
    host!:string
    port!:number
    sender!: string;
    secure!: boolean
    user!:string     //"testwegoing1@gmail.com", 
    password!:string     //pass: "youtube1A
    constructor(){
        this.avviato = false;
        this.host = conf.SMTP_HOST
        let pt =  conf.SMTP_PORT
       /*  if(!pt){
            logger.error(`[ENV] process.env.SMTP_PORT (${process.env.SMTP_PORT})  is not a number!`)
            process.exit();
        } */
        this.port = pt;
        let sc = conf.SMTP_SECURE
        /* if(sc == null || sc == undefined){
            logger.error(`[ENV] process.env.SMTP_SECURE (${process.env.SMTP_SECURE})  is not a boolean!`)
            process.exit();
        } */
        this.secure = sc;
        this.user = conf.SMTP_USER
        this.password = conf.SMTP_PASSWORD
        this.sender = `"IGP" <${this.user}>`
        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.secure, // true for 465, false for other ports
            auth: {
            user: this.user, 
            pass: this.password, 
            },
        });
    }
    async init(){
        try{

        
            
            await this.transporter.sendMail({
                from: this.sender, // sender address
                to: this.user, // list of receivers
                subject: "MailSender-IGP [ONLINE]✔", // Subject line
                text: `[${(new Date()).toLocaleTimeString()}] Il mail sender è online`, // plain text body
                //html: test, // html body
            }); 
            this.avviato = true;
        }catch(e){
            logger.error(`[MAIL]  ${(e as Error).message}`)
            this.avviato = false;
            throw e;
        }
    }
    
    async sendMail(receiver:string, subject:string, text:string ){
        try{
            // send mail with defined transport object
            let mail = await this.transporter.sendMail({
                from: this.sender, // sender address
                to: receiver, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
            //html: test, // html body
            });
        
            logger.info(`[MAIL]Message sent:  ${mail.messageId}`)
        
        }catch(e){
            logger.error(`[MAIL]  ${(e as Error).message}`)
            throw e;
        }
    } 
    async sendMailHTML(receiver:string, subject:string, text:string ,html:string){
        try{
            // send mail with defined transport object
            let mail = await this.transporter.sendMail({
                from: this.sender, // sender address
                to: receiver, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
                html: html, // html body
            });
        
            logger.info(`[MAIL]Message sent:  ${mail.messageId}`)
        
        }catch(e){
            logger.error(`[MAIL]  ${(e as Error).message}`)
            throw e;
        }
    }    
        
   
  }
  
