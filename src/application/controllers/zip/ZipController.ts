import { FastifyReply } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ZipRequest } from '@quorum/elisma/src/application/controllers/zip/entities/ZipRequest'

const logger = createLogger('ZipController')

export class ZipController {
  async generate(req: ZipRequest, res: FastifyReply): Promise<void> {
    const { selectedLibraries } = req.body
    logger.info(`Generating zip with payload ${JSON.stringify(selectedLibraries)}...`)
    //TODO
    return res.send()
  }
}
