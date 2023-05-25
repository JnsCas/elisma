import { ProjectFileHandler } from '@quorum/elisma/src/domain/bundle/entities/ProjectFileHandler'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { ProjectFile } from '@quorum/elisma/src/domain/bundle/entities/ProjectFile'
import fs from 'fs/promises'
import path from 'path'

export const NPM_PROJECT_FILE = 'package.json'

export class NpmProjectFileHandler extends ProjectFileHandler {
  constructor() {
    super(NPM_PROJECT_FILE)
  }

  async writeTo(project: Project, file: ProjectFile, outputDir: string): Promise<void> {
    const config = file.getEntries().reduce((result, config) => {
      const scripts = Object.assign({}, result.scripts, config.scripts)
      const dependencies = Object.assign({}, result.dependencies, config.dependencies)
      const devDependencies = Object.assign({}, result.devDependencies, config.devDependencies)
      return { ...result, ...config, scripts, dependencies, devDependencies }
    }, {})

    await fs.writeFile(path.join(outputDir, NPM_PROJECT_FILE), JSON.stringify(config, undefined, 2))
  }
}
