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
      libDependencies: [LibDependency.byName('elisma'), LibDependency.byName('pino')],
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(
      NpmDependency.runtime('fastify', '^4.17.0'),
      NpmDependency.runtime('@fastify/swagger', '^8.3.1'),
      NpmDependency.runtime('@fastify/swagger-ui', '^1.8.1')
    )
  }

  async prepare(bundle: Bundle<any>): Promise<void> {
    if (bundle.hasLibCategory(LibCategory.DatabaseDriver)) {
      bundle.addFiles(BundleFile.include(this, './src/domain'))
    }
    if (bundle.hasLib('mongo')) {
      bundle.addFiles(
        ...[
          BundleFile.include(this, './src/application/controllers/hello-mongo'),
          BundleFile.include(this, './src/bootstrap/controllers.mongo.ts'),
        ]
      )
    }
    if (bundle.hasLib('postgres')) {
      bundle.addFiles(
        ...[
          BundleFile.include(this, './src/application/controllers/hello-postgres'),
          BundleFile.include(this, './src/bootstrap/controllers.postgres.ts'),
        ]
      )
    }

    bundle.addFiles(
      ...[
        BundleFile.include(this, './src/application/controllers/hello-basic'),
        BundleFile.include(this, './src/bootstrap/controllers.basic.ts'),
        BundleFile.include(this, './src/application/controllers/index.ts'),
        BundleFile.include(this, './src/application/controllers/schemas.ts'),
        BundleFile.include(this, './src/application/plugins'),
        BundleFile.include(this, './src/bootstrap/server.ts'),
        BundleFile.include(this, './src/infra/errors'),
      ]
    )
  }
}
