import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'pino',
      description: 'Pino application logger',
      category: LibCategory.Logger,
      docs: `
        This library provides a global logger for the application. Application components can create a new scoped
        logger using the __createLogger()__ utility.
      `,
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(NpmDependency.runtime('pino', '^8.14.1'), NpmDependency.runtime('pino-pretty', '^10.0.0'))
  }

  async prepareBundle(bundle: Bundle<any>): Promise<void> {
    bundle.addFiles(BundleFile.include(this, './src/infra/log.ts'))
  }
}
