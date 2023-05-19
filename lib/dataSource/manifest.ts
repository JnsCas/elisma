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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async files(bundle: Bundle<NonNullable<unknown>>): Promise<BundleFile[]> {
    return [BundleFile.include('./src/infra/db')]
  }
}
