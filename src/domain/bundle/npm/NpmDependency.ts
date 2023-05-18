export class NpmDependency {
  static runtime(packageName: string, version: string): NpmDependency {
    return new NpmDependency(packageName, version, false)
  }

  static dev(packageName: string, version: string): NpmDependency {
    return new NpmDependency(packageName, version, true)
  }

  private constructor(
    /** Package name in the NPM registry. */
    readonly packageName: string,
    /** Package version. */
    readonly version: string,
    /** True if this is a dev dependency, false otherwise. */
    readonly isDev: boolean
  ) {}
}
