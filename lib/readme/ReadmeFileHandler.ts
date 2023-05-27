import fs from 'fs/promises'
import path from 'path'
import { ProjectFile } from '@quorum/elisma/src/domain/bundle/entities/ProjectFile'
import { ProjectFileHandler } from '@quorum/elisma/src/domain/bundle/entities/ProjectFileHandler'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export const README_FILE_NAME = 'README.md'

export class ReadmeFileHandler extends ProjectFileHandler {
  constructor() {
    super(README_FILE_NAME)
  }

  async writeTo(project: Project, file: ProjectFile, outputDir: string): Promise<void> {
    const resolvedConfig: string = project.manifests.reduce((result, manifest) => {
      if (manifest.docs) {
        const docs = manifest.docs.replaceAll(/^\s{8}/gim, '')
        return `${result}## ${manifest.description}\n\n${docs}\n\n`
      } else {
        return result
      }
    }, '')

    const resolvedPath = path.resolve(outputDir, path.dirname(file.name), path.basename(file.name))
    await fs.writeFile(resolvedPath, resolvedConfig)
  }
}
