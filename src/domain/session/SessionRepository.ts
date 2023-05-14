import { Session } from '@quorum/elisma/src/domain/session/entities/Session'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { Optional } from '@quorum/elisma/src/infra/Optional'

const logger = createLogger('SessionRepository')

export class SessionRepository {
  private readonly sessionById: Map<string, Session>

  constructor() {
    this.sessionById = new Map<string, Session>()
  }

  save(session: Session): void {
    logger.debug(`Saving session id ${session.id}`)
    this.sessionById.set(session.id, session)
  }

  update(session: Session): void {
    logger.debug(`Updating session id ${session.id}`)
    this.sessionById.set(session.id, session)
  }

  getById(id: string): Optional<Session> {
    logger.debug(`Retrieving session by id ${id}`)
    return this.sessionById.get(id)
  }
}
