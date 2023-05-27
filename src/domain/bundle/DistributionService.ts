import fs from 'fs/promises'
import path from 'path'
import archiver from 'archiver'
import { createReadStream, createWriteStream, ReadStream } from 'fs'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'

const logger = createLogger('DistributionService')

export class DistributionService {
  constructor(
    /** Service to generate the zip bundle. */
    readonly outputDir: string
  ) {}

  readZip(sessionId: string, bundle: Bundle): ReadStream {
    logger.info(`reading zip file for bundle: ${bundle.zipFileName}`)
    return createReadStream(path.join(this.outputDir, `${sessionId}.zip`))
  }

  async generateZip(sessionId: string, bundle: Bundle): Promise<void> {
    logger.info(`generating zip file for bundle: ${bundle.zipFileName}`)
    await this.buildZip(bundle.outputDir, path.join(this.outputDir, `${sessionId}.zip`))
  }

  private async buildZip(directoryPath: string, outputFilePath: string): Promise<void> {
    const output = createWriteStream(outputFilePath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    archive.pipe(output)

    const files = await fs.readdir(directoryPath)
    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const stat = await fs.stat(filePath)
      if (stat.isFile()) {
        archive.file(filePath, { name: file })
      } else if (stat.isDirectory()) {
        archive.directory(filePath, file)
      }
    }

    await archive.finalize()
  }
}
