import { OpenAIService } from '@quorum/elisma/src/domain/openai/OpenAIService'
import { FastifyReply } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { PromptRequest } from '@quorum/elisma/src/application/controllers/openai/entities/PromptRequest'
import { ChatResponse } from '@quorum/elisma/src/application/controllers/openai/entities/ChatResponse'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { ResourceNotFoundError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/ResourceNotFoundError'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { FastifyRequest } from 'fastify/types/request'

const logger = createLogger('OpenAIController')

export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService, private readonly sessionService: SessionService) {}

  async sendCompletion(req: PromptRequest, res: FastifyReply): Promise<void> {
    logger.info(`Sending completion to Open AI...`)
    const { prompt } = req.body
    const response = await this.openAIService.sendCompletion(prompt)
    return res.send(response)
  }

  async chat(req: PromptRequest, res: FastifyReply): Promise<void> {
    logger.info(`Sending chat to Open AI...`)
    const { prompt } = req.body
    const session = this.sessionService.getById(RequestContextHolder.getContext().sessionId)
    if (!session) {
      throw new ResourceNotFoundError()
    }

    let messageResponse
    if (session.shouldAnswerLanguage()) {
      messageResponse = await this.openAIService.receiveLanguage(session, prompt)
    } else if (session.shouldAnswerProjectName()) {
      messageResponse = await this.openAIService.receiveName(session, prompt)
    } else if (session.shouldAnswerRequirements()) {
      messageResponse = await this.openAIService.receiveRequirements(session, prompt)
    }
    return res.send(new ChatResponse(messageResponse, session.getScaffolding))
  }

  async askProgrammingLanguage(req: FastifyRequest, res: FastifyReply): Promise<void> {
    logger.info(`Asking programming language to the user...`)
    const response = await this.openAIService.askProgrammingLanguage()
    return res.send(response)
  }
}
