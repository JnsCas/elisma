import fs from 'fs/promises'
import path from 'path'
import { stringify } from 'yaml'

import { ProjectFile } from '@quorum/elisma/src/domain/bundle/entities/ProjectFile'
import { ProjectFileHandler } from '@quorum/elisma/src/domain/bundle/entities/ProjectFileHandler'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export const FILE_NAME = 'docker-compose.yml'

export class DockerComposeFileHandler extends ProjectFileHandler {
  constructor() {
    super(FILE_NAME)
  }

  async writeTo(project: Project, file: ProjectFile, outputDir: string): Promise<void> {
    const config = file.getEntries().reduce((result, config) => {
      const services = Object.assign({}, result.services, config.services)
      return { ...result, ...config, services }
    }, {})
    const resolvedPath = path.resolve(outputDir, path.dirname(file.name), path.basename(file.name))
    await fs.writeFile(resolvedPath, stringify(config))
  }
}
