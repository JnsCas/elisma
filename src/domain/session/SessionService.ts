import { createLogger } from '@quorum/elisma/src/infra/log'
import { Session } from '@quorum/elisma/src/domain/session/entities/Session'
import { UnauthorizedError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/UnauthorizedError'

const logger = createLogger('SessionService')

const sessionById = new Map<string, Session>()

export class SessionService {
  create() {
    logger.info(`Creating session...`)
    const session = Session.create()
    sessionById.set(session.id, session)
    return session
  }

  validate(sessionId: string): Session {
    logger.info(`Validating session id ${sessionId}...`)
    const session = sessionById.get(sessionId)
    if (!session) {
      throw new UnauthorizedError()
    }
    return session
  }
}
