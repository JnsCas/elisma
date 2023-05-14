import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'

export class ChatMessage {
  constructor(readonly role: Role, readonly content: string) {}
}
