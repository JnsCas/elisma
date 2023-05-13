import { createLogger } from '@quorum/elisma/src/infra/log'
import { HttpError } from '@quorum/elisma/src/infra/errors/HttpError'

const logger = createLogger('web:error')

export function CustomErrorHandler(error: HttpError, request: any, reply: any) {
  logger.error(error)
  reply.send(error)
}
