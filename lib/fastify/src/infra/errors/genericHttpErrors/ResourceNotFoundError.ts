import { HttpError } from '../HttpError'

export class ResourceNotFoundError extends HttpError {
  constructor(message = 'The resource you are looking for does not exist') {
    super(message, 404)
  }
}
