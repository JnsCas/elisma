import { Scaffolding } from '@quorum/elisma/src/domain/bundle/entities/Scaffolding'

export class ChatResponse {
  constructor(readonly message?: string, readonly scaffolding?: Scaffolding) {}
}
