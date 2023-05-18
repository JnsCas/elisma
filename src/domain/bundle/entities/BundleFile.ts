export class BundleFile {
  static include(source: string, target?: string, filtered?: boolean): BundleFile {
    return new BundleFile(
      source,
      target || source,
      filtered !== undefined ? filtered : source.endsWith('.ts') || source.endsWith('.js')
    )
  }

  private constructor(
    /** Source file in the library directory tree. */
    readonly source: string,
    /** Target file in the generated project directory tree. */
    readonly target: string,
    /** Indicates whether this file will be filtered before copy. */
    readonly filtered: boolean
  ) {}
}
