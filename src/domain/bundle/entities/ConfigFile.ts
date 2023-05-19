export abstract class ConfigFile<T> {
  protected constructor(
    /** Configuration file name. */
    readonly name: string
  ) {}

  abstract append(config: T): ConfigFile<T>
  abstract writeTo(outputDir: string): Promise<void>
}
