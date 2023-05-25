import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'express',
      description: 'Express web framework',
      category: LibCategory.WebFramework,
      unique: true,
      requires: [
        LibDependency.byName('elisma-loader'),
        LibDependency.byName('pino'),
        LibDependency.byName('dotenv'),
        LibDependency.byName('ping-domain'),
      ],
      excludes: [LibDependency.byCategory(LibCategory.CLI), LibDependency.byCategory(LibCategory.WebFramework)],
      docs: `
        This library integrates Express using an opinionated project structure. It will generate the following
        directory structure:
        
          [root]
            |--> application
            |   |--> controllers
            |   |   |--> pings
            |   |   |   |--> HelloController.ts
            |   |   |   |--> schemas.ts
            |   |   |--> index.ts
            |--> domain
            |   |--> pings
            |       |--> entities
            |--> bootstrap
                |--> controllers.ts
                |--> server.express.ts
      `,
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(
      NpmDependency.runtime('express', '^4.18.2'),
      NpmDependency.runtime('bson-objectid', '^2.0.4'),
      NpmDependency.dev('@types/express', '^4.17.17')
    )
    project.file('.env').append({
      SERVER_PORT: '6000',
      SERVER_HOST: '0.0.0.0',
    })
  }

  async prepareBundle(bundle: Bundle<any>): Promise<void> {
    if (bundle.hasLib('mongo')) {
      bundle.addFiles(BundleFile.include(this, './src/bootstrap/controllers.mongo.ts'))
    }
    if (bundle.hasLib('postgres')) {
      bundle.addFiles(BundleFile.include(this, './src/bootstrap/controllers.postgres.ts'))
    }

    bundle.addFiles(
      BundleFile.include(this, './src/application'),
      BundleFile.include(this, './src/bootstrap/controllers.basic.ts'),
      BundleFile.include(this, './src/bootstrap/server.ts'),
      BundleFile.include(this, './src/infra/RouteUtils.ts')
    )
  }
}
