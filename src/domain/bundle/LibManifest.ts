import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { ManifestConfig } from '@quorum/elisma/src/domain/bundle/ManifestConfig'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export abstract class LibManifest {
  protected constructor(readonly config: ManifestConfig) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configureProject<T>(project: Project<T>): Promise<void> {
    return Promise.resolve()
  }

  abstract prepare<T extends NonNullable<unknown>>(bundle: Bundle<T>): Promise<void>
}
