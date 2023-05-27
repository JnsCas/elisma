import { FastifyReply, FastifyRequest } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

const logger = createLogger('LanguageController')

export class LanguageController {
  async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
    logger.info(`Retrieving languages...`)
    return res.send(Object.values(ProjectLanguage)) //FIXME get it from manifest
  }
}
