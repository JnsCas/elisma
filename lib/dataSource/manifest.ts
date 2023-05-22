import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'dataSource',
      description: 'data source common interface',
      category: LibCategory.DatabaseDriver,
      requires: [LibDependency.byName('pino')],
      docs: `
        This library provides support for all database drivers. It exports a DataSource interface that can be
        extended by drivers to support features like connection and transaction management.
      `,
    })
  }

  async prepareBundle(bundle: Bundle<any>): Promise<void> {
    bundle.addFiles(BundleFile.include(this, './src/infra/db'))
  }
}
