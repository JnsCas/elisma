import { HttpError } from '@quorum/elisma/src/infra/errors/HttpError'

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}
