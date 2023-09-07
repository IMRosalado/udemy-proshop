import { Request, Response } from "express"

const loggerMiddleware = (req: Request, res: Response, next) => {
  console.log({
    url: req.path,
    method: req.method,
    params: req.params
  })
  next();
}

export default loggerMiddleware;