
import config from './config'
import dotenv from 'dotenv'
import { exit } from 'process'
import Database from "@db/indexdb"
import { cronObj } from "./cron/cronJobs"
//import 'reflect-metadata'
import {mailHelper} from "@helper/mailer/mailHelper"
import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes'
import bodyParser from 'body-parser'
import logger from "@logger";
import { corsHandler } from "@helper/corsHandler/corsHandler"
import expressLogger from '@helper/expressLogger'
import { genAdmin } from "@scripts/genAdmin"

import { genSettings } from '@scripts/genSettings'

    //"exec": "ts-node -r ./src/app.ts"

//logger.info('[APP] Starting...');
/* const env = dotenv.config();
if(env.error){
  logger.error('[APP] Missing enviroment file, shutting down');
  exit();
} */
//test commit dopo amend
let conf = config
export const db = new Database();
export  const mailer = new mailHelper();
const init = db.init();
//const isDev = `${process.env.NODE_ENV}`=="development";
const isDev = conf.IN_DEVELOPMENT
init.then(async () =>{
  const app = express()
  app.use(expressLogger);
  app.use(corsHandler);
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', routes)
  
  const PORT : number = conf.SERVER_PORT
  const server = app.listen(PORT, function(){
    logger.info(`[APP] Started on port ${PORT}`);
  });
  cronObj.init();
  try{
    if(conf.SMTP_START){
      await mailer.init();

    }
  }catch(e){
    logger.error(`[MAIL] [INIT] ${(e as Error).message}`);
  }
  //script di riempimento tabelle
  //questo pezzo andrà messo in una funzione generale 
  
  await genAdmin();
  await genSettings();
/*   try{
    await genF1Mappe();
    await genF1Teams();
  }catch(e){
    let msg = (e as Error).message;
    if(msg != NO_GAMES) throw e;
  } */
 /*  if(isDev){
    await genFakeUsers();
    await fillFakeTeamsWithFakeUsers();
  } */
  /////////////////////////////////////////////////////
  logger.info(`[APP] init completed, ready to handle requests`);
  
  [ 
    'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
  ].forEach((sig) => {
    process.on(sig  , async () => {
      logger.info(`[APP] Shutting down by ${sig}...`)
      server.close();
      for(let i=0;i<cronObj.scheduled.length;i++){
        cronObj.scheduled[i].stop();
      }
      await db.stop()
    });
  })
});
init.catch((err) => {
  logger.error('[APP] Database initialization failed, shutting down');
  logger.error(`[APP] Detail: ${err}`)
  for(let i=0;i<cronObj.scheduled.length;i++){
    cronObj.scheduled[i].stop();
  }
  exit(0)
});

