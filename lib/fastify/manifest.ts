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

  async files(bundle: Bundle<any>): Promise<BundleFile[]> {
    const baseFiles: BundleFile[] = []

    if (bundle.libs.some((library) => library.category === LibCategory.DatabaseDriver)) {
      baseFiles.push(
        ...[
          BundleFile.include('./src/application/controllers/hello-data-source'),
          BundleFile.include('./src/bootstrap/controllers.dataSource.ts', 'src/bootstrap/controllers.ts'),
        ]
      )
    } else {
      baseFiles.push(
        ...[
          BundleFile.include('./src/application/controllers/hello-basic'),
          BundleFile.include('./src/bootstrap/controllers.basic.ts', 'src/bootstrap/controllers.ts'),
        ]
      )
    }

    return [
      ...baseFiles,
      BundleFile.include('./src/application/controllers/index.ts'),
      BundleFile.include('./src/application/controllers/schemas.ts'),
      BundleFile.include('./src/application/plugins'),
      BundleFile.include('./src/bootstrap/server.ts'),
      BundleFile.include('./src/infra/errors'),
    ]
  }
}
