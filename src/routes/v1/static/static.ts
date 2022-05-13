

import logger from '@logger';
import express, { Router } from 'express'
import private_route from './private/private'
import path from 'path';
const pb_public = path.join(__dirname,"../../../../public")

const routes = Router()
routes.use(function (req, res, next) {
    logger.debug("PASSO INTERCEPTOR A LIVELLO STATIC")

    logger.debug(req.url);
    next();
  });
  

routes.use("/public",express.static(pb_public));
routes.use('/private',private_route)





export default routes
