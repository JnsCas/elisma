import path from 'path'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'

export class BundleFile {
  static include(manifest: LibManifest, source: string, target?: string): BundleFile {
    return new BundleFile(
      manifest,
      path.join(manifest.config.name, source),
      target || source,
      source.endsWith('.ts') || source.endsWith('.js')
    )
  }

  private constructor(
    /** Library that owns this file. */
    readonly manifest: LibManifest,
    /** Source file in the library directory tree. */
    readonly source: string,
    /** Target file in the generated project directory tree. */
    readonly target: string,
    /** Indicates whether this file will be filtered before copy. */
    readonly mustFilter: boolean
  ) {}

  filtered(): BundleFile {
    return new BundleFile(this.manifest, this.source, this.target, true)
  }

  update(source: string, target: string): BundleFile {
    return new BundleFile(this.manifest, source, target, this.mustFilter)
  }
}
