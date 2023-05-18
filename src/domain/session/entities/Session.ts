import { IdManager } from '@quorum/elisma/src/infra/IdManager'
import { ChatMessage } from '@quorum/elisma/src/domain/openai/entities/ChatMessage'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'
import { firstPrompt } from '@quorum/elisma/src/domain/session/entities/Prompts'
import { Scaffolding } from '@quorum/elisma/src/domain/scaffolding/entities/Scaffolding'
import { Language } from '@quorum/elisma/src/domain/scaffolding/entities/Language'
import { Library } from '@quorum/elisma/src/domain/scaffolding/entities/Library'

export class Session {
  private scaffolding: Scaffolding

  private constructor(readonly id: string, readonly messages: ChatMessage[]) {
    this.scaffolding = new Scaffolding()
  }

  static create(): Session {
    return new Session(IdManager.randomId(), [new ChatMessage(Role.USER, firstPrompt())])
  }

  addChatMessage(role: Role, message: string): Session {
    this.messages.push(new ChatMessage(role, message))
    return this
  }

  setScaffolingLanguage(language: Language) {
    this.scaffolding.setLanguage(language)
  }

  setScaffolingName(name: string) {
    this.scaffolding.setName(name)
  }

  setScaffolingRequirements(requirements: string) {
    this.scaffolding.setRequirements(requirements)
  }

  setScaffoldingSelectedLibraries(libraries: Library[]) {
    this.scaffolding.setSelectedLibraries(libraries)
  }

  shouldAnswerLanguage(): boolean {
    return this.scaffolding.languageIsEmpty()
  }

  shouldAnswerProjectName(): boolean {
    return this.scaffolding.nameIsEmpty()
  }

  shouldAnswerRequirements(): boolean {
    return this.scaffolding.requirementsIsEmpty()
  }

  get getScaffolding(): Scaffolding {
    return this.scaffolding
  }
}
