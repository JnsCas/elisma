import { FastifyRequest } from 'fastify'

export type GetSessionByIdRequest = FastifyRequest<{
  Params: {
    id: string
  }
}>
