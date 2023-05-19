import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'

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

  readonly files: BundleFile[] = []

  addFiles(...files: BundleFile[]): Bundle<DependencyType> {
    this.files.push(...files)
    return this
  }

  get zipFileName(): string {
    return `${this.project.name}.zip`
  }

  hasLib(name: string): boolean {
    return this.libs.some((library) => library.packageName === name)
  }

  hasLibCategory(category: string): boolean {
    return this.libs.some((library) => library.category === category)
  }
}
