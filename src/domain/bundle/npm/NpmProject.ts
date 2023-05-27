import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { NPM_PROJECT_FILE, NpmProjectFileHandler } from '@quorum/elisma/src/domain/bundle/npm/NpmProjectFileHandler'
import { ProjectFile } from '@quorum/elisma/src/domain/bundle/entities/ProjectFile'

const PackageJsonFile = {
  name: '@quorum/lib',
  version: '1.0.0',
  scripts: {},
  license: 'GPL-2.0',
  dependencies: {},
  devDependencies: {},
}

export class NpmProject extends Project {
  static create(name: string, language: ProjectLanguage, manifests: LibManifest[]): NpmProject {
    return new NpmProject(name, language, manifests)
  }

  private constructor(
    name: string,
    language: ProjectLanguage,
    /** Libraries included in this project. */
    manifests: LibManifest[]
  ) {
    super(name, language, manifests)
    this.registerFileHandler(new NpmProjectFileHandler())
    this.configFile.append({ ...PackageJsonFile, name })
  }

  get configFile(): ProjectFile {
    return this.file(NPM_PROJECT_FILE)
  }

  addDependencies(...dependencies: NpmDependency[]): Project {
    dependencies.forEach((dependency) => {
      if (dependency.isDev) {
        this.configFile.append({
          devDependencies: {
            [dependency.packageName]: dependency.version,
          },
        })
      } else {
        this.configFile.append({
          dependencies: {
            [dependency.packageName]: dependency.version,
          },
        })
      }
    })
    return this
  }
}
