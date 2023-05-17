import { Language } from '@quorum/elisma/src/domain/scaffolding/entities/Language'

export class Scaffolding {
  private language?: Language
  private name?: string
  private requirements?: string

  constructor() {
    this.language = undefined
    this.name = undefined
    this.requirements = undefined
  }

  setLanguage(language: Language): Scaffolding {
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

  languageIsEmpty(): boolean {
    return this.language === undefined
  }

  nameIsEmpty(): boolean {
    return this.name === undefined
  }

  requirementsIsEmpty(): boolean {
    return this.requirements === undefined
  }
}
