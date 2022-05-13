import logger from '../logger';
import { NextFunction } from 'express';
import * as http from 'http';

function getActualRequestDurationInMilliseconds(start: [number, number]){
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

export default function expressLogger(req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) : void{
  const method = req.method;
  const url = req.url;
  const start = process.hrtime();
  req.on("end", function(){
    const status = res.statusCode;
    let durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    let timeunit = "ms";
    if(durationInMilliseconds > 1000){
      durationInMilliseconds /= 1000;
      timeunit = "s";
    }
    const duration = durationInMilliseconds.toLocaleString();
    logger.info(`[HTTP] ${method}:${url} ${status} ${duration}${timeunit}`);
  });
  
  next();
}