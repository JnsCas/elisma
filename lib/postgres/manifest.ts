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
      name: 'postgres',
      languages: [ProjectLanguage.TYPESCRIPT, ProjectLanguage.JAVASCRIPT],
      description: 'PostgreSQL database driver',
      category: LibCategory.DatabaseDriver,
      requires: [LibDependency.byName('pino'), LibDependency.byName('data-source')],
      docs: `
        This library implements a data source for PostgreSQL.
        
        If the dotenv library is present, it will add a __DB_POSTGRES_CONNECTION_STRING__ environment variable to
        configure a local connection for the application. If elisma is present it will also register a component
        called __postgresDataSource__ in the ApplicationRegistry.
        
        If the docker-compose library is present, it will register the following service:
        
          postgres:
            image: postgres:12.8
            environment:
              - POSTGRES_DB=app_local
              - POSTGRES_USER=app
              - POSTGRES_PASSWORD=app_passwd
            ports:
              - '5432:5432'
            volumes:
              - ./tmp/postgres:/var/lib/postgresql/data
              - ./etc/postgres:/docker-entrypoint-initdb.d
        
        The DB data will be persisted in a volume mounted in the __./tmp/postgres__ directory. Other libraries can add
        initialization files in the __etc/postgres/__ directory.
      `,
    })
  }

  async configureProject(project: Project): Promise<void> {
    project.addDependencies(
      NpmDependency.runtime('pg', '^8.8.0'),
      NpmDependency.runtime('pg-promise', '^11.0.2'),
      NpmDependency.dev('@types/pg', '^8.6.6')
    )
    project.file('.env').append({
      DB_POSTGRES_CONNECTION_STRING: 'postgresql://app:app_passwd@localhost:5432/app_local',
    })
    project.file('docker-compose.yml').append({
      services: {
        postgres: {
          image: 'postgres:12.8',
          ports: ['5432:5432'],
          volumes: ['./tmp/postgres:/var/lib/postgresql/data', './etc/postgres:/docker-entrypoint-initdb.d'],
          environment: {
            POSTGRES_USER: 'app',
            POSTGRES_PASSWORD: 'app_passwd',
            POSTGRES_DB: 'app_local',
          },
        },
      },
    })
  }

  async prepareBundle(bundle: Bundle): Promise<void> {
    if (bundle.hasLib('dotenv') && bundle.hasLib('elisma-loader')) {
      bundle.addFiles(BundleFile.include(this, './src/bootstrap/postgres.ts'))
    }
    bundle.addFiles(BundleFile.include(this, './src/infra/db/PostgresDataSource.ts'))
  }
}
