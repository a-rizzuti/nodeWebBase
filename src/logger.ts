import config from '@config';
import winston from 'winston'
import   { format }  from "winston"
import 'winston-daily-rotate-file';
import fs from 'fs'
import moment from 'moment';
import dotenv from 'dotenv'
import { exit } from 'process'

//const conf = Config.getInstance();
//console.log(config)
const conf = config
const { combine, printf } = format
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green'
}
const colorizer = winston.format.colorize({colors});

const logDir = __dirname + '/../logs'
//console.log("__dirname value="+__dirname );
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, '0744')
}

const defaultFormat = printf(({ level, message }) => {
  const _level = level.toUpperCase();
  let timestamp =  moment().format('YYYY-MM-DD HH:mm:ss').trim() 
  return colorizer.colorize(level,`[${timestamp}][${_level}]${message}\n<----`)
})
const DailyRotateCombine = new winston.transports.DailyRotateFile({
  filename: `${logDir}/combine-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d'
});
const DailyRotateInfo = new winston.transports.DailyRotateFile({
  filename: `${logDir}/info-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'info'
});
const DailyRotateWarn = new winston.transports.DailyRotateFile({
  filename: `${logDir}/warn-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'warn'
});
const DailyRotateError = new winston.transports.DailyRotateFile({
  filename: `${logDir}/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error'
});

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: combine(
    winston.format.timestamp(),
    defaultFormat,
  ),
  transports: [
    /*new winston.transports.Console({
      format: combine(
        winston.format.timestamp( ),
        format.timestamp( 
        ),
        defaultFormat
      ),
    }),
    */
    DailyRotateError,
    DailyRotateInfo,
    DailyRotateWarn,
    DailyRotateCombine,
    

  ]
})
//const env = dotenv.config();
/* if(env.error){
  logger.error('[APP] Missing enviroment file, shutting down');
  exit();
}
if ( process.env.VERBOSE === "true"){
  logger.add(new winston.transports.Console({
    format: combine(
      winston.format.timestamp( ),
      format.timestamp( ),
      defaultFormat
      )
    }))
  }
  
  

if(process.env.NODE_ENV === 'development') {
  logger.level = 'debug';
  logger.info("[LOGGER]  is in development mode")
} */

if (conf.VERBOSE){
  logger.add(new winston.transports.Console({
    format: combine(
      winston.format.timestamp( ),
      format.timestamp( ),
      defaultFormat
      )
    }))
  }
  
  

if(conf.IN_DEVELOPMENT) {
  logger.level = 'debug';
  logger.info("[LOGGER]  is in development mode")
}


export default logger;
