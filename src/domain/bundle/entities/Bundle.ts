import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export class Bundle<DependencyType> {
  static create<T>(project: Project<T>, libs: LibraryDefinition[], outputDir: string): Bundle<T> {
    return new Bundle(project, libs, outputDir)
  }

  private constructor(
    /** Project associated to this bundle. */
    readonly project: Project<DependencyType>,
    /** Libraries included in this bundle. */
    readonly libs: LibraryDefinition[],
    /** Path to write files to. */
    readonly outputDir: string
  ) {}
}
