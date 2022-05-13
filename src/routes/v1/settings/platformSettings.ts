import { Router } from 'express'

import { isLoggedMiddleware } from '@auth/middleware/isLogged';
import { SuperAdminMiddleware } from '@auth/middleware/SuperAdminMiddleware';
import { getAllSettings } from '@services/amministrazione/gestioneSettings/getAllSettings';
import { editSetting } from '@services/amministrazione/gestioneSettings/editSetting';
import logger from '@logger';


const routes = Router()
 routes.use(async function (req, res, next) {
   //await isLoggedMiddleware(req,res,next);
   logger.debug(`Passato intercept livello settings`)
   await isLoggedMiddleware(req,res, async () => await SuperAdminMiddleware(req,res,next))
   //await SuperAdminMiddleware(req,res,next)

 })


routes.get('/', async (req,res) => { await getAllSettings(req,res)} )
routes.get('/id/:id',async (req,res) => { res.status(501).send('not implemented')})
routes.get('/key/:key',async (req,res) => { res.status(501).send('not implemented')})
routes.patch('/', async (req,res) => { await editSetting(req,res)})



export default routes

