import { Router, Request, Response } from 'express'
import { refreshToken } from '@services/token/refreshToken'

import { getPersonalInfo } from '@services/users/misc/getPersonalInfo'
import { isLoggedMiddleware } from '@auth/middleware/isLogged'

const router = Router()

router.use(async function (req, res, next) {
   await isLoggedMiddleware(req,res,next);
})


export default router

router.get("/payload", async (req:Request, res:Response) =>  {
  res.send(200);
});


router.post("/refreshToken",async (req:Request, res:Response) => await refreshToken(req,res));

router.get("/myInfo", async (req,res) =>  await getPersonalInfo(req,res))



