export class LibraryDefinition {
  static create(packageName: string, category: string, url: string): LibraryDefinition {
    return new LibraryDefinition(packageName, category, url)
  }

  private constructor(
    /** Package name. */
    readonly packageName: string,
    /** Library category, used to classify different type of technologies. */
    readonly category: string,
    /** Url of the npm registry. */
    readonly url: string
  ) {}
}
