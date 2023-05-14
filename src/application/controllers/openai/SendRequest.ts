import { FastifyRequest } from 'fastify'

export type SendRequest = FastifyRequest<{
  Body: {
    prompt: string
  }
}>
