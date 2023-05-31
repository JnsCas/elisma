import path from 'path'
import fs from 'fs/promises'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { ProjectFile } from '@quorum/elisma/src/domain/bundle/entities/ProjectFile'
import { ProjectFileHandler } from '@quorum/elisma/src/domain/bundle/entities/ProjectFileHandler'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'

const logger = createLogger('Project')

export abstract class Project {
  protected constructor(
    /** Project name. */
    readonly name: any,
    /** Programming language. */
    readonly language: ProjectLanguage,
    /** Libraries included in this project. */
    readonly manifests: LibManifest[]
  ) {}

  abstract addDependencies(...dependencies: any[]): Project
  abstract get configFile(): ProjectFile

  private readonly files: { [key: string]: ProjectFile } = {}
  private readonly filesHandlers: { [key: string]: ProjectFileHandler } = {}

  registerFileHandler(handler: ProjectFileHandler): Project {
    if (!this.filesHandlers[handler.name]) {
      this.filesHandlers[handler.name] = handler
    }
    return this
  }

  file(name: string): ProjectFile {
    if (!this.files[name]) {
      this.files[name] = ProjectFile.create(name)
    }

    return this.files[name]
  }

  async writeConfig(outputDir: string): Promise<void> {
    logger.info(`writing configuration files to: ${outputDir}`)

    await Promise.all(
      Object.values(this.files).map(async (configFile) => {
        const handler = Object.values(this.filesHandlers).find((handler) => handler.accepts(configFile))
        if (handler) {
          const configPath = path.resolve(outputDir, path.dirname(configFile.name))
          await fs.mkdir(configPath, { recursive: true })
          await handler.writeTo(this, configFile, outputDir)
        } else {
          logger.warn(`config file has no handler: ${configFile.name}`)
        }
      })
    )
  }
}
