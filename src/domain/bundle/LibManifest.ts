import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { ManifestConfig } from '@quorum/elisma/src/domain/bundle/ManifestConfig'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'
import { Optional } from '@quorum/elisma/src/infra/Optional'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

export abstract class LibManifest {
  protected constructor(
    config: ManifestConfig,
    /** NPM package name. */
    readonly name: string = config.name,
    /** Library category. */
    readonly category: LibCategory = config.category,
    /** Programming languages supported by this library. */
    readonly languages: ProjectLanguage[] = config.languages,
    /** Library description. */
    readonly description: Optional<string> = config.description,
    /** Library documentation. */
    readonly docs: Optional<string> = config.docs,
    /** List of libraries names this library depends on. */
    readonly requires: LibDependency[] = config.requires ?? [],
    /** List of libraries that are explicitly excluded if this library is selected. */
    readonly excludes: LibDependency[] = config.excludes ?? [],
    /** Load order, a higher number represents a higher priority. */
    readonly order: number = config.order ?? 0,
    /** Indicates whether this library must be unique in the category. */
    readonly unique: boolean = config.unique ?? false
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async configureProject<T extends Project>(project: T): Promise<void> {
    return Promise.resolve()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async prepareBundle(bundle: Bundle): Promise<void> {
    return Promise.resolve()
  }
}
