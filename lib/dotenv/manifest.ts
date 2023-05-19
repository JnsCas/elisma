import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { DotEnvConfigFile } from './DotEnvConfigFile'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'dotenv',
      order: 9999999,
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(NpmDependency.runtime('dotenv', '^16.0.3'))
    project.addConfigFile(new DotEnvConfigFile())
  }

  async prepare(bundle: Bundle<any>): Promise<void> {
    bundle.addFiles(BundleFile.include(this, './src/bootstrap/dotenv.ts'))
  }
}
