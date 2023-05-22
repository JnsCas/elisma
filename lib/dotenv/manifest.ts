import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { DotEnvFileHandler } from './DotEnvFileHandler'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'dotenv',
      description: 'reads environment configuration from a .env file',
      category: LibCategory.Configuration,
      unique: true,
      docs: `
        This library loads environment variables from a .env file. It adds a bootstrap file that will load the
        environment configuration into memory before the application initialization.
        
        Other libraries can append configuration to the a project file called '.env' using the following format:
        
        project.file('.env').append({
          ENV_VAR: 'value',
          OTHER_VAR: 'value'
        })
        
        This library provides a file handler that will create the .env file in the final package.
      `,
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(NpmDependency.runtime('dotenv', '^16.0.3'))
    project.registerFileHandler(new DotEnvFileHandler())
  }

  async prepareBundle(bundle: Bundle<any>): Promise<void> {
    bundle.addFiles(BundleFile.include(this, './src/bootstrap/dotenv.ts'))
  }
}
