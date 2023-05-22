import * as fs from 'fs/promises'
import path from 'path'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'

export class NpmProject extends Project<NpmDependency> {
  static create(name: string, language: ProjectLanguage, manifests: LibManifest[], metadata: any): NpmProject {
    return new NpmProject(name, language, manifests, metadata)
  }

  private constructor(
    name: string,
    language: ProjectLanguage,
    /** Libraries included in this project. */
    manifests: LibManifest[],
    metadata: any
  ) {
    super(name, language, manifests, metadata)
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
