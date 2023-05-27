import { ProjectFile } from '@quorum/elisma/src/domain/bundle/entities/ProjectFile'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export abstract class ProjectFileHandler {
  protected constructor(
    /** Configuration file name. */
    readonly name: string
  ) {}

  accepts(configFile: ProjectFile): boolean {
    return configFile.name === this.name
  }

  abstract writeTo(project: Project, file: ProjectFile, outputDir: string): Promise<void>
}
