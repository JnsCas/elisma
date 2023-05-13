import { FastifyRequest } from 'fastify'
import { Optional } from '@quorum/elisma/src/infra/Optional'
import { UnauthorizedError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/UnauthorizedError'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { Session } from '@quorum/elisma/src/domain/session/entities/Session'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { ElismaRequestContext } from '@quorum/elisma/src/infra/context/ElismaRequestContext'

export enum Headers {
  session = 'x-session-id',
}

export default function (request: FastifyRequest, sessionService: SessionService) {
  const sessionId = request.headers[Headers.session] as Optional<string>

  if (!sessionId) {
    throw new UnauthorizedError()
  }

  const session: Session = sessionService.validate(sessionId)
  RequestContextHolder.init(new ElismaRequestContext(session))
}
