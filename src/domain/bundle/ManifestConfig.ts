import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'

export type ManifestConfig = {
  /** NPM package name. */
  name: string
  /** List of libraries names this library depends on. */
  libDependencies?: LibDependency[]
  /** Load order, a higher number represents a higher priority. */
  order?: number
}
