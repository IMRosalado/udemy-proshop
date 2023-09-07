import { Request, Response } from "express"

const loggerMiddleware = (req: Request, res: Response, next) => {
  if(process.env.NODE_ENV === 'development') {
    console.log({
      url: req.path,
      method: req.method,
      params: req.params
    })
  }
  next();
}

export default loggerMiddleware;