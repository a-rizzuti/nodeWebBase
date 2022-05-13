

import settings from './settings/platformSettings'
import * as user from "./users/index";
import static_route from './static/static'
import test from './test/test'
import { Router } from 'express';

const routes = Router()
routes.use('/user', user.user)

//routes.use("/static/public",express.static(pb));
routes.use('/settings',settings)
routes.use("/static",static_route);

routes.use('/test',test)
export default routes

