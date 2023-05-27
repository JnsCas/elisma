import path from 'path'
import { FastifyReply } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { GenerateZipRequest } from '@quorum/elisma/src/application/controllers/zip/entities/GenerateZipRequest'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { BundleService } from '@quorum/elisma/src/domain/bundle/BundleService'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { NpmProject } from '@quorum/elisma/src/domain/bundle/npm/NpmProject'
import { ResourceNotFoundError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/ResourceNotFoundError'
import { BadRequestError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/BadRequestError'
import { SupportedLibraries } from '@quorum/elisma/src/SupportedLibraries'
import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { DownloadZipRequest } from '@quorum/elisma/src/application/controllers/zip/entities/DownloadZipRequest'
import { DistributionService } from '@quorum/elisma/src/domain/bundle/DistributionService'
import { ManifestService } from '@quorum/elisma/src/domain/bundle/ManifestService'

const logger = createLogger('ZipController')

export class ZipController {
  constructor(
    /** Service to read the current session. */
    readonly sessionService: SessionService,
    /** Service to generate the project bundle. */
    readonly bundleService: BundleService,
    /** Service to handle library manifests. */
    readonly manifestService: ManifestService,
    /** Service to generate and read zip files. */
    readonly distributionService: DistributionService
  ) {}

  async download(req: DownloadZipRequest, res: FastifyReply): Promise<void> {
    const { sessionId } = req.params
    logger.info(`downloading zip for session: ${sessionId}`)
    const session = await this.sessionService.getById(sessionId)
    if (!session || !session.bundle) {
      throw new ResourceNotFoundError(`session not found: ${sessionId}`)
    }

    const readStream = this.distributionService.readZip(sessionId, session.bundle)

    return res
      .type('application/zip')
      .header('Cache-Control', 'no-store')
      .header('Content-Disposition', `attachment; filename=${session.bundle.zipFileName}`)
      .send(readStream)
  }

  async generate(req: GenerateZipRequest, res: FastifyReply): Promise<void> {
    const { projectName, selectedLanguage, selectedLibraries } = req.body

    logger.info(`Generating zip with payload ${JSON.stringify(selectedLibraries)}...`)

    const sessionId = RequestContextHolder.getContext().sessionId
    const session = await this.sessionService.getById(sessionId)
    if (!session) {
      throw new ResourceNotFoundError(`session not found: ${sessionId}`)
    }

    const libs = selectedLibraries.map(
      (selectedLib) =>
        SupportedLibraries.find(
          (supportedLib) => selectedLib.packageName === supportedLib.packageName
        ) as LibraryDefinition
    )
    // eslint-disable-next-line no-control-regex
    const name = projectName.replace(/[^\x00-\x7F]/g, '')
    const normalizedName = name.startsWith('@') ? name : `@${name}`
    const outputDir = path.join(process.cwd(), `out/${sessionId}/`)

    const manifests = await this.manifestService.findManifests(libs.map((lib) => lib.packageName))
    const bundle = await this.bundleService.build(
      Bundle.create(NpmProject.create(normalizedName, selectedLanguage as ProjectLanguage, manifests), outputDir)
    )

    await this.sessionService.update(session.updateBundle(bundle))
    await this.distributionService.generateZip(sessionId, bundle)

    return res.send()
  }
}
