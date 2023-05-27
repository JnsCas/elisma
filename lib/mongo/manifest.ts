import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'mongo',
      languages: [ProjectLanguage.TYPESCRIPT, ProjectLanguage.JAVASCRIPT],
      description: 'mongodb database driver',
      category: LibCategory.DatabaseDriver,
      requires: [LibDependency.byName('pino'), LibDependency.byName('data-source')],
      docs: `
        This library implements a data source for MongoDB.
        
        If the dotenv library is present, it will add a __DB_MONGO_CONNECTION_STRING__ environment variable to
        configure a local connection for the application. If elisma is present it will also register a component
        called __mongoDataSource__ in the ApplicationRegistry.
        
        If the docker-compose library is present, it will register the following service:
        
          mongo:
            image: mongo:5.0.9
            ports:
              - '27017:27017'
            volumes:
              - ./tmp/mongo/data:/data/db
              - ./etc/mongo:/docker-entrypoint-initdb.d
        
        The DB data will be persisted in a volume mounted in the __./tmp/mongo__ directory. Other libraries can add
        initialization files in the __etc/mongo/__ directory.
      `,
    })
  }

  async configureProject(project: Project): Promise<void> {
    project.addDependencies(NpmDependency.runtime('mongoose', '^6.8.3'))
    project.file('.env').append({
      DB_MONGO_CONNECTION_STRING: 'mongodb://localhost:27017/app_local',
    })
    project.file('docker-compose.yml').append({
      services: {
        mongo: {
          image: 'mongo:5.0.9',
          ports: ['27017:27017'],
          volumes: ['./tmp/mongo/data:/data/db', './etc/mongo:/docker-entrypoint-initdb.d'],
        },
      },
    })
  }

  async prepareBundle(bundle: Bundle): Promise<void> {
    if (bundle.hasLib('dotenv') && bundle.hasLib('elisma-loader')) {
      bundle.addFiles(BundleFile.include(this, './src/bootstrap/mongo.ts'))
    }
    bundle.addFiles(BundleFile.include(this, './src/infra/db/mongo'))
  }
}
