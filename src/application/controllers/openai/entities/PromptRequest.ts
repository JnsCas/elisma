import { FastifyRequest } from 'fastify'

export type PromptRequest = FastifyRequest<{
  Body: {
    prompt: string
  }
}>
