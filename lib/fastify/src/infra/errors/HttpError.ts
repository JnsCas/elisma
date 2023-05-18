export abstract class HttpError extends Error {
  private readonly statusCode: number

  protected constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}
