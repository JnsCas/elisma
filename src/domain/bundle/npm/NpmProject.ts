import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import * as fs from 'fs/promises'
import path from 'path'

export class NpmProject extends Project<NpmDependency> {
  static create(name: string, language: ProjectLanguage, metadata: any): NpmProject {
    return new NpmProject(name, language, metadata)
  }

  private constructor(name: string, language: ProjectLanguage, metadata: any) {
    super(name, language, metadata)
    metadata.name = name
  }

  addDependencies(...dependencies: NpmDependency[]): Project<NpmDependency> {
    dependencies.forEach((dependency) => {
      if (dependency.isDev) {
        this.metadata.devDependencies[dependency.packageName] = dependency.version
      } else {
        this.metadata.dependencies[dependency.packageName] = dependency.version
      }
    })
    return this
  }

  async writeTo(outputDir: string): Promise<void> {
    await fs.writeFile(path.join(outputDir, 'package.json'), JSON.stringify(this.metadata, undefined, 2))
  }
}
