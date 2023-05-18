import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'

export class LibDependency {
  static byName(name: string): LibDependency {
    return new LibDependency(name, undefined)
  }

  static byCategory(category: LibCategory): LibDependency {
    return new LibDependency(undefined, category)
  }

  private constructor(
    /** Library name. */
    readonly name?: string,
    /** Library type. */
    readonly category?: LibCategory
  ) {}
}
