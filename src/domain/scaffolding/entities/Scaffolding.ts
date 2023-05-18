import { Library } from '@quorum/elisma/src/domain/scaffolding/entities/Library'
import { ProjectLanguage } from '@quorum/elisma/src/domain/scaffolding/entities/ProjectLanguage'

export class Scaffolding {
  private language?: ProjectLanguage
  private name?: string
  private requirements?: string
  private selectedLibraries: Library[]

  constructor() {
    this.language = undefined
    this.name = undefined
    this.requirements = undefined
    this.selectedLibraries = []
  }

  setLanguage(language: ProjectLanguage): Scaffolding {
    this.language = language
    return this
  }

  setName(name: string): Scaffolding {
    this.name = name
    return this
  }

  setRequirements(requirements: string): Scaffolding {
    this.requirements = requirements
    return this
  }

  setSelectedLibraries(libraries: Library[]): Scaffolding {
    this.selectedLibraries = libraries
    return this
  }

  languageIsEmpty(): boolean {
    return this.language === undefined
  }

  nameIsEmpty(): boolean {
    return this.name === undefined
  }

  requirementsIsEmpty(): boolean {
    return this.requirements === undefined
  }

  get getLanguage() {
    return this.language
  }

  get getName() {
    return this.name
  }
}
