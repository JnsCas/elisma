import { OpenAIService } from '@quorum/elisma/src/domain/openai/OpenAIService'
import { FastifyReply } from 'fastify'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { SendRequest } from '@quorum/elisma/src/application/controllers/openai/SendRequest'

const logger = createLogger('OpenAIController')

export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  async send(req: SendRequest, res: FastifyReply): Promise<void> {
    logger.info(`Receiving prompt to send to Open AI...`)
    const { prompt } = req.body
    const response = await this.openAIService.send(prompt)
    return res.send(response)
  }
}
