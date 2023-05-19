import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'postgres',
      libDependencies: [LibDependency.byName('pino'), LibDependency.byName('dataSource')],
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(
      NpmDependency.runtime('pg', '^8.8.0'),
      NpmDependency.runtime('pg-promise', '^11.0.2'),
      NpmDependency.dev('@types/pg', '^8.6.6')
    )
  }

  async prepare(bundle: Bundle<NonNullable<unknown>>): Promise<void> {
    bundle.addFiles(
      ...[
        BundleFile.include(this, './src/infra/db/PostgresDataSource.ts'),
        BundleFile.include(this, './src/bootstrap/postgres.ts'),
      ]
    )
  }
}
