import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

export type ManifestConfig = {
  /** NPM package name. */
  name: string
  /** Library category. */
  category: LibCategory
  /** Programming languages supported by this library. */
  languages: ProjectLanguage[]
  /** Library description. */
  description?: string
  /** Library documentation. */
  docs?: string
  /** List of libraries names this library depends on. */
  requires?: LibDependency[]
  /** List of libraries that are explicitly excluded if this library is selected. */
  excludes?: LibDependency[]
  /** Load order, a higher number represents a higher priority. */
  order?: number
  /** Indicates whether this library must be unique in the category. */
  unique?: boolean
}
