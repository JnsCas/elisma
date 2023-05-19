import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'dataSource',
      libDependencies: [LibDependency.byName('pino')],
    })
  }

  async prepare(bundle: Bundle<any>): Promise<void> {
    bundle.addFiles(BundleFile.include(this, './src/infra/db'))
  }
}
