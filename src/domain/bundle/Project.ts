import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { ConfigFile } from '@quorum/elisma/src/domain/bundle/entities/ConfigFile'

export abstract class Project<DependencyType> {
  protected constructor(
    /** Project name. */
    readonly name: any,
    /** Programming language. */
    readonly language: ProjectLanguage,
    /** Object representing the project metadata. */
    readonly metadata: any
  ) {}

  abstract addDependencies(...dependencies: DependencyType[]): Project<DependencyType>
  abstract writeTo(outputDir: string): Promise<void>

  private readonly configFiles: { [key: string]: ConfigFile<any> } = {}

  addConfigFile<T>(file: ConfigFile<T>): Project<DependencyType> {
    if (this.configFiles[file.name]) {
      throw new Error(`config file already exist: ${file.name}`)
    }
    this.configFiles[file.name] = file
    return this
  }

  configFile<T>(name: string): ConfigFile<T> {
    if (!this.configFiles[name]) {
      throw new Error(`config file does not exist: ${name}`)
    }

    return this.configFiles[name]
  }

  async writeConfig(outputDir: string): Promise<void> {
    await Promise.all(Object.values(this.configFiles).map(async (configFile) =>
      await configFile.writeTo(outputDir)
    ))
  }
}
