import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'

export class CandidateFile {
  static create(manifest: LibManifest, file: BundleFile): CandidateFile {
    return new CandidateFile(manifest, file)
  }

  private constructor(
    /** Resolved library manifest. */
    readonly manifest: LibManifest,
    /** File to copy. */
    readonly bundleFile: BundleFile
  ) {}

  get source(): string {
    return this.bundleFile.source
  }

  get target(): string {
    return this.bundleFile.target
  }

  get filtered(): boolean {
    return this.bundleFile.mustFilter
  }
}
