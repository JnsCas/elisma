import ObjectID from 'bson-objectid'
import { Request, Response } from 'express'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { PingService } from '@quorum/lib/ping-domain/src/domain/pings/PingService'
import { Ping } from '@quorum/lib/ping-domain/src/domain/pings/entities/Ping'

const logger = createLogger('HelloController')

export class HelloController {
  constructor(private readonly pingService: PingService) {}

  async ping(req: Request, res: Response): Promise<Response> {
    logger.info('pong!')
    const { message } = req.query
    await this.pingService.save(Ping.create(ObjectID().toHexString(), message as string))
    return res.send(`pong: ${message}`)
  }
}
