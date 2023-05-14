import { createLogger } from '@quorum/elisma/src/infra/log'
import { Session } from '@quorum/elisma/src/domain/session/entities/Session'
import { UnauthorizedError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/UnauthorizedError'
import { SessionRepository } from '@quorum/elisma/src/domain/session/SessionRepository'
import { Optional } from '@quorum/elisma/src/infra/Optional'

const logger = createLogger('SessionService')

export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  create() {
    logger.info(`Creating session...`)
    const session = Session.create()
    this.sessionRepository.save(session)
    return session
  }

  validate(sessionId: string): Session {
    logger.info(`Validating session id ${sessionId}...`)
    const session = this.sessionRepository.getById(sessionId)
    if (!session) {
      throw new UnauthorizedError()
    }
    return session
  }

  getById(id: string): Optional<Session> {
    logger.info(`Retrieving session by id ${id}...`)
    return this.sessionRepository.getById(id)
  }

  update(session: Session): Session {
    logger.info(`Updating session id ${session.id}...`)
    this.sessionRepository.update(session)
    return session
  }
}
