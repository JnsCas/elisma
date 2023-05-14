import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { FastifyReply, FastifyRequest } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'

const logger = createLogger('SessionController')

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
    logger.info(`Creating session...`)
    const session = this.sessionService.create()
    return res.send(session)
  }
}
