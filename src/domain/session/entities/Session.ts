import { IdManager } from '@quorum/elisma/src/infra/IdManager'
import { Scaffolding } from '@quorum/elisma/src/domain/bundle/entities/Scaffolding'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { Optional } from '@quorum/elisma/src/infra/Optional'

export class Session {
  private scaffolding: Scaffolding
  private resolvedBundle?: Bundle<any>

  private constructor(readonly id: string) {
    this.scaffolding = new Scaffolding()
  }

  static create(): Session {
    return new Session(IdManager.randomId())
  }

  setScaffolingLanguage(language: ProjectLanguage) {
    this.scaffolding.setLanguage(language)
  }

  setScaffolingName(name: string) {
    this.scaffolding.setName(name)
  }

  setScaffolingRequirements(requirements: string) {
    this.scaffolding.setRequirements(requirements)
  }

  setScaffoldingSelectedLibraries(libraries: LibraryDefinition[]) {
    this.scaffolding.setSelectedLibraries(libraries)
  }

  updateBundle(bundle: Bundle<any>): Session {
    this.resolvedBundle = bundle
    return this
  }

  get bundle(): Optional<Bundle<any>> {
    return this.resolvedBundle
  }

  get getScaffolding(): Scaffolding {
    return this.scaffolding
  }
}
