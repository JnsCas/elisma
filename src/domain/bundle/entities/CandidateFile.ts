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
    private readonly file: BundleFile
  ) {}

  get source(): string {
    return this.file.source
  }

  get target(): string {
    return this.file.target
  }

  get filtered(): boolean {
    return this.file.filtered
  }
}
