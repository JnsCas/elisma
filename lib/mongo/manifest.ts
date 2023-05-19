import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'mongo',
      libDependencies: [
        LibDependency.byName('pino'),
        LibDependency.byName('dataSource'),
        LibDependency.byName('dotenv'),
      ],
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.addDependencies(NpmDependency.runtime('mongoose', '^6.8.3'))
    project.configFile('.env').append({
      DB_MONGO_CONNECTION_STRING: 'mongodb://localhost:27017/app_local',
    })
  }

  async prepare(bundle: Bundle<NonNullable<unknown>>): Promise<void> {
    bundle.addFiles(
      ...[BundleFile.include(this, './src/infra/db/mongo'), BundleFile.include(this, './src/bootstrap/mongo.ts')]
    )
  }
}
