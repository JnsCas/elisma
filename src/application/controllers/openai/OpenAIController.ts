import { OpenAIService } from '@quorum/elisma/src/domain/openai/OpenAIService'
import { FastifyReply } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { PromptRequest } from '@quorum/elisma/src/application/controllers/openai/entities/PromptRequest'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { ResourceNotFoundError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/ResourceNotFoundError'
import { SendChatCompletionMessagesRequest } from '@quorum/elisma/src/application/controllers/openai/entities/SendChatCompletionMessagesRequest'
import { ChatMessage } from '@quorum/elisma/src/domain/openai/entities/ChatMessage'

const logger = createLogger('OpenAIController')

export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService, private readonly sessionService: SessionService) {}

  async sendCompletion(req: PromptRequest, res: FastifyReply): Promise<void> {
    logger.info(`Sending completion to Open AI...`)
    const { prompt } = req.body
    const response = await this.openAIService.sendCompletion(prompt)
    return res.send(response)
  }

  async sendChatCompletion(req: PromptRequest, res: FastifyReply): Promise<void> {
    logger.info(`Sending chat completion to Open AI...`)
    const { prompt } = req.body
    const session = this.sessionService.getById(RequestContextHolder.getContext().sessionId)
    if (!session) {
      throw new ResourceNotFoundError()
    }

    //FIXME (jns) move this logic to service
    let response
    if (session.shouldAnswerRequirements) {
      response = await this.openAIService.selectLibraries(prompt)
    } else {
      response = await this.openAIService.sendChatCompletion(prompt)
    }
    return res.send(response)
  }

  async selectLibraries(req: PromptRequest, res: FastifyReply): Promise<void> {
    logger.info(`Selecting libraries...`)
    const { prompt } = req.body
    const response = await this.openAIService.selectLibraries(prompt)
    return res.send(response)
  }

  async sendChatCompletionMessages(req: SendChatCompletionMessagesRequest, res: FastifyReply): Promise<void> {
    logger.info(`Sending chat completion messages to Open AI...`)
    const { messages } = req.body
    const response = await this.openAIService.sendChatCompletionMessages(
      messages.map((message) => new ChatMessage(message.role, message.prompt))
    )
    return res.send(response)
  }
}
