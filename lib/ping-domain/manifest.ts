import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'ping-domain',
      description: 'Opinionated application module that shows how to implement domain-driven design in a Node project.',
      category: LibCategory.ProjectComponent,
      unique: true,
      requires: [LibDependency.byName('elisma-loader'), LibDependency.byName('pino')],
      docs: `
        This is a standalone module that can be used in different types of applications (webapp, CLI, etc) to quick
        off a project using domain-driven design principles. This module proposes a project structure that is tested
        in a wide range of projects in production, and it scales very well.
        
        The goal of the domain layer in DDD is to hold the business logic and concepts. It should not contain any
        client-facing related logic like HTTP request handling in a webapp. The client-facing logic is delegated
        to the __application layer__ components like controllers and commands, and these components must use the
        domain _only_ through __domain services__.
        
        In the __src/domain/__ directory we will create a new directory for each domain concept we want to represent as
        a standalone CRUD. In this example, we have the __pings__. Inside the __pings__ directory we will have
        (at least) two types of components: repositories for data access, and services for the business logic and
        orchestration. Services can compose one or more repositories, and also another services. Repositories will be
        restricted to data access, either a DB or an API or whatever strategy to manage data.
        
        We will also have an __entities__ directory which has the domain entities. An entity represents a concept in
        the domain, and it might or might not be coupled to the data structure for storing the information. It is
        important to remark that an entity is not the data model. A single entity could be stored across different
        tables in a DB, or populated with data from different data sources.
      `,
    })
  }

  async prepareBundle(bundle: Bundle<any>): Promise<void> {
    if (bundle.hasLib('mongo')) {
      bundle.addFiles(BundleFile.include(this, './src/domain/pings/MongoPingRepository.ts'))
    }
    if (bundle.hasLib('postgres')) {
      bundle.addFiles(
        BundleFile.include(this, './src/domain/pings/PostgresPingRepository.ts'),
        BundleFile.include(this, './etc/postgres')
      )
    }

    bundle.addFiles(
      BundleFile.include(this, './src/domain/pings/entities'),
      BundleFile.include(this, './src/domain/pings/InMemoryPingRepository.ts'),
      BundleFile.include(this, './src/domain/pings/PingRepository.ts'),
      BundleFile.include(this, './src/domain/pings/PingService.ts')
    )
  }
}
