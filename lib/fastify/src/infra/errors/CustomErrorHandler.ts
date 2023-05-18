import { HttpError } from './HttpError'
import { createLogger } from '@quorum/lib/pino/src/infra/log'

const logger = createLogger('web:error')

export function CustomErrorHandler(error: HttpError, request: any, reply: any) {
  logger.error(error)
  reply.send(error)
}
