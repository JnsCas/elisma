import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'fastify',
      languages: [ProjectLanguage.TYPESCRIPT, ProjectLanguage.JAVASCRIPT],
      description: 'Fastify web framework',
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
        This library integrates Fastify using an opinionated project structure. It will generate the following
        directory structure:
        
          [root]
            |--> application
            |   |--> controllers
            |   |   |--> pings
            |   |   |   |--> HelloController.ts
            |   |   |   |--> schemas.ts
            |   |   |--> index.ts
            |   |--> plugins
            |   |--> middlewares
            |--> domain
            |   |--> pings
            |       |--> entities
            |--> bootstrap
                |--> controllers.ts
                |--> server.ts
      `,
    })
  }

  async configureProject(project: Project): Promise<void> {
    project.addDependencies(
      NpmDependency.runtime('fastify', '^4.17.0'),
      NpmDependency.runtime('@fastify/swagger', '^8.3.1'),
      NpmDependency.runtime('@fastify/swagger-ui', '^1.8.1'),
      NpmDependency.runtime('bson-objectid', '^2.0.4')
    )
    project.file('.env').append({
      SERVER_PORT: '5000',
      SERVER_HOST: '0.0.0.0',
    })
  }

  async prepareBundle(bundle: Bundle): Promise<void> {
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
      BundleFile.include(this, './src/infra/errors')
    )
  }
}
