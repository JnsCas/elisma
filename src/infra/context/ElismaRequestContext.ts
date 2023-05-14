import { Session } from '@quorum/elisma/src/domain/session/entities/Session'

export class ElismaRequestContext {
  constructor(private readonly session: Session) {}

  get sessionId(): string {
    return this.session.id
  }
}
