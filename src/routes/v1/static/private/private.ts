
import { isLoggedMiddleware } from '@auth/middleware/isLogged';
import logger from '@logger';
import express, { Router } from 'express'

import path from 'path';
const pb_private = path.join(__dirname,"../../../../../private")

const routes = Router()
    routes.use(async function (req, res, next) {
     await isLoggedMiddleware(req,res,next);
})

routes.use("",express.static(pb_private));





export default routes
