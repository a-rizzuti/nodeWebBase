import { Router } from 'express'
import logger from '../logger';

import v1 from './v1'

const routes = Router()
routes.use(function (req, res, next) {
    logger.debug("PASSO INTERCEPTOR")
    next();
  });
routes.use('/v1', v1)

export default routes
