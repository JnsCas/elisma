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
      name: 'fastify',
      description: 'Fastify web framework',
      category: LibCategory.WebFramework,
      unique: true,
      requires: [LibDependency.byName('elisma'), LibDependency.byName('pino'), LibDependency.byName('dotenv')],
      excludes: [LibDependency.byCategory(LibCategory.CLI)],
      docs: `
        This library integrates Fastify using an opinionated project structure. It will generate the following
        directory structure:
        
          [root]
            |--> application
            |   |--> controllers
            |   |   |--> domainConcept
            |   |   |   |--> HelloController.ts
            |   |   |   |--> schemas.ts
            |   |   |--> index.ts
            |   |--> plugins
            |   |--> middlewares
            |--> domain
            |   |--> domainConcept
            |       |--> entities
            |--> bootstrap
                |--> controllers.ts
                |--> server.ts
      `,
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(
      NpmDependency.runtime('fastify', '^4.17.0'),
      NpmDependency.runtime('@fastify/swagger', '^8.3.1'),
      NpmDependency.runtime('@fastify/swagger-ui', '^1.8.1')
    )
    project.file('.env').append({
      SERVER_PORT: '5000',
      SERVER_HOST: '0.0.0.0',
    })
  }

  async prepareBundle(bundle: Bundle<any>): Promise<void> {
    if (bundle.hasLibCategory(LibCategory.DatabaseDriver)) {
      bundle.addFiles(BundleFile.include(this, './src/domain'))
    }
    if (bundle.hasLib('mongo')) {
      bundle.addFiles(
        BundleFile.include(this, './src/application/controllers/hello-mongo'),
        BundleFile.include(this, './src/bootstrap/controllers.mongo.ts')
      )
    }
    if (bundle.hasLib('postgres')) {
      bundle.addFiles(
        BundleFile.include(this, './src/application/controllers/hello-postgres'),
        BundleFile.include(this, './src/bootstrap/controllers.postgres.ts')
      )
    }

    bundle.addFiles(
      BundleFile.include(this, './src/application/controllers/hello-basic'),
      BundleFile.include(this, './src/bootstrap/controllers.basic.ts'),
      BundleFile.include(this, './src/application/controllers/index.ts'),
      BundleFile.include(this, './src/application/controllers/schemas.ts'),
      BundleFile.include(this, './src/application/plugins'),
      BundleFile.include(this, './src/bootstrap/server.ts'),
      BundleFile.include(this, './src/infra/errors')
    )
  }
}
