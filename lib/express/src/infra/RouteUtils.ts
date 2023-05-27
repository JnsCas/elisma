import { Handler, Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'

export function endpoint(handler: (req: Request, res: Response) => Promise<any>): Handler {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res).catch(next)
  }
}
