import { Scaffolding } from '@quorum/elisma/src/domain/scaffolding/entities/Scaffolding'

export class ChatResponse {
  constructor(readonly message?: string, readonly scaffolding?: Scaffolding) {}
}
