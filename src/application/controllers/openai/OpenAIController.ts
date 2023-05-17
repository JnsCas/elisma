import { OpenAIService } from '@quorum/elisma/src/domain/openai/OpenAIService'
import { FastifyReply } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { PromptRequest } from '@quorum/elisma/src/application/controllers/openai/entities/PromptRequest'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'

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
    const response = await this.openAIService.chat(prompt)
    return res.send(response)
  }
}
