import { IdManager } from '@quorum/elisma/src/infra/IdManager'
import { ChatMessage } from '@quorum/elisma/src/domain/openai/entities/ChatMessage'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'

export class Session {
  private constructor(readonly id: string, readonly messages: ChatMessage[]) {}

  static create(): Session {
    return new Session(IdManager.randomId(), [])
  }

  addChatMessage(role: Role, message: string): Session {
    this.messages.push(new ChatMessage(role, message))
    return this
  }
}
