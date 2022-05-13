import cors from "cors";
import logger from "@logger"
import conf from "@config"

const CORS_ERROR_MESSAGE =  'The CORS policy for this site does not allow access from the specified Origin.';
         
//quando si va in deploy devo ricordarmi di mettere credentials:true
export let corsHandler = cors({
    origin: function(origin, callback){
      let allowedOrigins = conf.deployUrl
      if(!origin) return callback(null, true);   
      if(allowedOrigins.indexOf(origin) < 0){
        logger.warn(`[REST] [CORS] UNKNOWN ORGIN ${origin}`);
        return callback(new Error(CORS_ERROR_MESSAGE), false);
      }
      return callback(null, true);
    },credentials:true
})