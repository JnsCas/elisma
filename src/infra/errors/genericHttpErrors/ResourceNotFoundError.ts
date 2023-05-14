import { HttpError } from '@quorum/elisma/src/infra/errors/HttpError'

export class ResourceNotFoundError extends HttpError {
  constructor(message = 'The resource you are looking for does not exist') {
    super(message, 404)
  }
}
