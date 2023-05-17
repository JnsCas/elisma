import { FastifyRequest } from 'fastify'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'

type Message = {
  prompt: string
  role: Role
}

export type SendChatCompletionMessagesRequest = FastifyRequest<{
  Body: {
    messages: Message[]
  }
}>
