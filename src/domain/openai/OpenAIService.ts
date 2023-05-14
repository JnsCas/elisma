import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { ResourceNotFoundError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/ResourceNotFoundError'
import { ChatCompletionResponseMessage } from 'openai'

const logger = createLogger('OpenAIService')

export class OpenAIService {
  constructor(private readonly openAIClient: OpenAIClient, private readonly sessionService: SessionService) {}

  async sendCompletion(prompt: string) {
    logger.info(`Sending prompt to completion Open AI...`)
    return await this.openAIClient.createCompletion(prompt)
  }

  async sendChatCompletion(prompt: string) {
    logger.info(`Sending prompt to chat completion Open AI...`)
    const session = this.sessionService.getById(RequestContextHolder.getContext().sessionId)
    if (!session) {
      throw new ResourceNotFoundError()
    }
    session.addChatMessage(Role.USER, prompt)
    const chatCompletionResponse = await this.openAIClient.createChatCompletion(session.messages)
    const messageResponse = chatCompletionResponse.choices[0].message
    if (messageResponse) {
      session.addChatMessage(messageResponse.role as Role, messageResponse.content)
    }
    this.sessionService.update(session)
    return messageResponse
  }
}
