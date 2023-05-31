import { FastifyReply, FastifyRequest } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ManifestService } from '@quorum/elisma/src/domain/bundle/ManifestService'

const logger = createLogger('LibraryController')

export class LibraryController {
  constructor(private readonly manifestService: ManifestService) {}

  async getAll(req: FastifyRequest, res: FastifyReply) {
    logger.info(`Retrieving all the libraries...`)
    return res.send(await this.manifestService.loadManifests())
  }
}
