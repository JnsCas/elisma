export class BundleFile {
  static include(source: string, target?: string): BundleFile {
    return new BundleFile(source, target || source, source.endsWith('.ts') || source.endsWith('.js'))
  }

  private constructor(
    /** Source file in the library directory tree. */
    readonly source: string,
    /** Target file in the generated project directory tree. */
    readonly target: string,
    /** Indicates whether this file will be filtered before copy. */
    readonly mustFilter: boolean
  ) {}

  filtered(): BundleFile {
    return new BundleFile(this.source, this.target, true)
  }

  update(source: string, target: string): BundleFile {
    return new BundleFile(source, target, this.mustFilter)
  }
}
