import logger from "@logger";
import dotenv from 'dotenv'
import { exit } from 'process'
import { Dialect } from "sequelize/types";
export  class Config {
    private static instance: Config;
    
    private static allowedDialets : Dialect[] = [ 'mariadb', 'mysql', "sqlite"]
    private static undefined:string = `undefined`
    private static development = 'development'
    //dev settings
    NODE_ENV!:string 
    VERBOSE!: boolean;

    IN_DEVELOPMENT:boolean = false;//INDUCTED VARIABLE 
    
    //express settings
    SERVER_PORT!:number;

    //deploy settings
    DEPLOY!:string;
    LOCALHOST !: string;

    deployUrl:string[] = []
    //MYSQL_SETTINGS
    MYSQL_HOST!:string
    MYSQL_PORT!:number
    MYSQL_USER!:string
    MYSQL_PASS!:string
    MYSQL_DBNM!:string
    MYSQL_DIALECT!:Dialect
    MYSQL_STORAGE!:string
    MYSQL_HAS_LOGIN !: boolean
    //SMTP
    SMTP_START!:boolean;
    SMTP_HOST!:string
    SMTP_PORT!:number
    SMTP_SECURE!: boolean
    SMTP_USER!:string
    SMTP_PASSWORD!:string

    // ADMIN DEFAULT CREDS
    ADMIN_NICKNAME!:string
    ADMIN_EMAIL!:string
    ADMIN_DEFAULT_PASSWORD!:string

    //JWT
    JWT_SECRET_KEY!:string

    //default stuff
    DEFAULT_IMG_UTENTE!:string;

    private constructor() { }

   
    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
            Config.instance.init();
        }

        return Config.instance;
    }
    private init(){
        console.log('starting config.init')
        const env = dotenv.config();
        if(env.error){
            //logger.error('[APP] [ENV] Missing enviroment file, shutting down');
            console.log('[APP] [ENV] Missing enviroment file, shutting down')
            exit();
        }
        try{
            this.readEnv();
        }catch(e){
            let err = (e as Error)
            console.log(`Error in config.init`)
            console.log(err.message);

            //logger.error(`[APP] [ENV] error name: ${err.name} - message: ${err.message}\n shutting down`);
            exit(1)
        }
        
    }
    private readEnv(){
        this.handleDevSettings();
        //ogger.info(`[APP][ENV] app starting....`)
        this.handleExpressSettings();
        this.handleAdminSettings();
        this.handleDeploySettings();
        this.handleMysqlSettings();
        this.handleSmtpSettings();
        this.handleJTWSettings();
        this.handleDefaultStuff();
    }

    private handleDevSettings(){
        this.NODE_ENV = `${process.env.NODE_ENV}`
        if(this.NODE_ENV == Config.undefined)throw new Error(`Node env non definito nel file .env`)
        this.IN_DEVELOPMENT = this.NODE_ENV == Config.development
        this.VERBOSE = `${process.env.VERBOSE}` == "true"
    }

    private handleExpressSettings(){
        let inFile = `${process.env.SERVER_PORT}`;
        this.SERVER_PORT = Number(inFile);
        if(this.SERVER_PORT == NaN) throw new Error(`SERVER PORT non è un numero nel file .env`)
    }

    private handleDeploySettings(){
        this.DEPLOY = `${process.env.DEPLOY}`;
        if(this.DEPLOY == Config.undefined)throw new Error(`Deploy non definito nel file .env`)
        this.LOCALHOST = `${process.env.LOCALHOST}`;
        if(this.LOCALHOST == Config.undefined)throw new Error(`Localhost non definito nel file .env`)
        this.deployUrl = [this.DEPLOY,this.LOCALHOST];
    }

    private handleMysqlSettings(){
        this.MYSQL_DIALECT = `${process.env.MYSQL_DIALECT}` as Dialect;
        if(!Config.allowedDialets.includes(`${this.MYSQL_DIALECT}`))throw new Error(`MYSQL_DIALECT non definito correttamente nel file .env`)
        
        if(this.MYSQL_DIALECT != "sqlite"){
            this.MYSQL_HOST = `${process.env.MYSQL_HOST}`;
            
            if(this.MYSQL_HOST == Config.undefined)throw new Error(`MYSQL HOST non definito nel file .env`)
            let nconv = `${process.env.MYSQL_PORT}`;
            
            this.MYSQL_PORT = Number(nconv);
            if(this.MYSQL_PORT == NaN) throw new Error(`MYSQL PORT non è un numero nel file .env`)
            
            this.MYSQL_USER = `${process.env.MYSQL_USER}`;
            if(this.MYSQL_USER == Config.undefined)throw new Error(`MYSQL USER non definito nel file .env`)
            
            this.MYSQL_PASS = `${process.env.MYSQL_PASS}`;
            if(this.MYSQL_PASS == Config.undefined)throw new Error(`MYSQL PASS non definito nel file .env`)
            
            this.MYSQL_DBNM = `${process.env.MYSQL_DBNM}`;
            if(this.MYSQL_DBNM == Config.undefined)throw new Error(`MYSQL DBNM non definito nel file .env`)
            
            this.MYSQL_HAS_LOGIN = true;
            return;
        }
        
        this.MYSQL_HAS_LOGIN = false;
        this.MYSQL_STORAGE = `${process.env.MYSQL_STORAGE}`
    }

    private handleSmtpSettings(){
        this.SMTP_START = `${process.env.SMPT_START}` == 'true';
        this.SMTP_HOST = `${process.env.SMTP_HOST}`;
        if(this.SMTP_HOST == Config.undefined)throw new Error(`SMTP HOST non definito nel file .env`)
        let nconv = `${process.env.SMTP_PORT}`;
        this.SMTP_PORT = Number(nconv);
        if(this.SMTP_PORT == NaN) throw new Error(`SMTP PORT non è un numero nel file .env`)
        this.SMTP_SECURE = `${process.env.SMTP_SECURE}` == "true"
        this.SMTP_USER = `${process.env.SMTP_USER}`;
        if(this.SMTP_USER == Config.undefined)throw new Error(`SMTP USER non definito nel file .env`)
        this.SMTP_PASSWORD = `${process.env.SMTP_PASSWORD}`;
        if(this.SMTP_PASSWORD == Config.undefined)throw new Error(`SMTP PASSWORD non definito nel file .env`)
    }
    
    private handleAdminSettings(){
        this.ADMIN_NICKNAME = `${process.env.ADMIN_NICKNAME}`;
        if(this.ADMIN_NICKNAME == Config.undefined)throw new Error(`ADMIN NICKNAME non definito nel file .env`)
        this.ADMIN_EMAIL= `${process.env.ADMIN_EMAIL}`;
        if(this.ADMIN_EMAIL == Config.undefined)throw new Error(`ADMIN EMAIL non definito nel file .env`)
        this.ADMIN_DEFAULT_PASSWORD = `${process.env.ADMIN_DEFAULT_PASSWORD}`;
        if(this.ADMIN_DEFAULT_PASSWORD == Config.undefined)throw new Error(`ADMIN DEFAULT PASSWORD non definito nel file .env`)
    }

    private handleJTWSettings(){
        this.JWT_SECRET_KEY = `${process.env.JWT_SECRET_KEY}`;
        if(this.JWT_SECRET_KEY == Config.undefined)throw new Error(`JWT SECRET KEY non definito nel file .env`)
    }

    private handleDefaultStuff(){
        this.DEFAULT_IMG_UTENTE = `${process.env.DEFAULT_PROFILE}`
    }
}
const conf = Config.getInstance();
export default conf;