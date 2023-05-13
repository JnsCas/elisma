import { HttpError } from '@quorum/elisma/src/infra/errors/HttpError'

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(message, 400)
  }
}
