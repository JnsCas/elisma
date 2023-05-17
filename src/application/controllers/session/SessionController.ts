import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { FastifyReply, FastifyRequest } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { GetSessionByIdRequest } from '@quorum/elisma/src/application/controllers/session/entities/GetSessionByIdRequest'

const logger = createLogger('SessionController')

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
    logger.info(`Creating session...`)
    const session = this.sessionService.create()
    return res.send(session)
  }

  async getById(req: GetSessionByIdRequest, res: FastifyReply): Promise<void> {
    const { id } = req.params
    logger.info(`Retrieving session by id ${id}...`)
    const session = this.sessionService.getById(id)
    return res.send(session)
  }
}
