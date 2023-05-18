import { FastifyRequest } from 'fastify'

export type EchoRequest = FastifyRequest<{
  Querystring: {
    message: string
  }
}>
