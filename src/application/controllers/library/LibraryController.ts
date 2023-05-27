import { FastifyReply, FastifyRequest } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { SupportedLibraries } from '@quorum/elisma/src/SupportedLibraries'

const logger = createLogger('LibraryController')

export class LibraryController {
  getAll(req: FastifyRequest, res: FastifyReply) {
    logger.info(`Retrieving all the libraries...`)
    return res.send(SupportedLibraries)
  }
}
