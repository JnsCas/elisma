import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

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
}
