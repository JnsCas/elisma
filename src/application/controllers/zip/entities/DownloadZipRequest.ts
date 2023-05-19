import { FastifyRequest } from 'fastify'

export type DownloadZipRequest = FastifyRequest<{
  Params: {
    sessionId: string
  }
}>
