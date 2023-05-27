import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'

export class Bundle {
  static create(project: Project, outputDir: string): Bundle {
    return new Bundle(project, outputDir)
  }

  private constructor(
    /** Project associated to this bundle. */
    readonly project: Project,
    /** Path to write files to. */
    readonly outputDir: string
  ) {}

  readonly files: BundleFile[] = []

  addFiles(...files: BundleFile[]): Bundle {
    this.files.push(...files)
    return this
  }

  get zipFileName(): string {
    return `${this.project.name}.zip`
  }

  hasLib(name: string): boolean {
    return this.project.manifests.some((library) => library.name === name)
  }

  hasLibCategory(category: string): boolean {
    return this.project.manifests.some((library) => library.category === category)
  }
}
