import * as crypto from 'crypto'
import { FastifyReply } from 'fastify'
import { EchoRequest } from '@quorum/lib/fastify/src/application/controllers/hello-postgres/EchoRequest'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { PingService } from '@quorum/lib/fastify/src/domain/pings/PingService'
import { Ping } from '@quorum/lib/fastify/src/domain/pings/entities/Ping'

const logger = createLogger('HelloController')

export class HelloController {
  constructor(private readonly pingService: PingService) {}

  async ping(req: EchoRequest, res: FastifyReply): Promise<void> {
    logger.info('pong!')
    const { message } = req.query
    await this.pingService.save(Ping.create(crypto.randomUUID(), message))
    return res.send(`pong: ${message}`)
  }
}
