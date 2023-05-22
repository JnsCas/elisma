import fs from 'fs/promises'
import path from 'path'
import { ProjectFile } from '@quorum/elisma/src/domain/bundle/entities/ProjectFile'
import { ProjectFileHandler } from '@quorum/elisma/src/domain/bundle/entities/ProjectFileHandler'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export const DOTENV_FILE_NAME = '.env'

export class DotEnvFileHandler extends ProjectFileHandler {
  constructor() {
    super(DOTENV_FILE_NAME)
  }

  async writeTo(project: Project<any>, file: ProjectFile, outputDir: string): Promise<void> {
    const config = file.getEntries().reduce((result, config) => ({ ...result, ...config }), {})
    const resolvedConfig: string = Object.keys(config)
      .sort()
      .reduce((result, key) => {
        return `${result}${key}=${config[key]}\n`
      }, '')

    const resolvedPath = path.resolve(outputDir, path.dirname(file.name), path.basename(file.name))
    await fs.writeFile(resolvedPath, resolvedConfig)
  }
}
