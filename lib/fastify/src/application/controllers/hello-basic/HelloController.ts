import { FastifyReply } from 'fastify'
import { EchoRequest } from '@quorum/lib/fastify/src/application/controllers/hello-basic/EchoRequest'
import { createLogger } from '@quorum/lib/pino/src/infra/log'

const logger = createLogger('HelloController')

export class HelloController {
  async ping(req: EchoRequest, res: FastifyReply): Promise<void> {
    logger.info('pong!')
    const { message } = req.query
    return res.send(`pong: ${message}`)
  }
}
