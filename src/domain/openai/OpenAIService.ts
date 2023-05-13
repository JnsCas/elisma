import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'
import { createLogger } from '@quorum/elisma/src/infra/log'

const logger = createLogger('OpenAIService')

export class OpenAIService {
  constructor(private readonly openAIClient: OpenAIClient) {}

  async send(prompt: string) {
    logger.info(`Sending prompt to Open AI...`)
    return await this.openAIClient.createCompletion(prompt)
  }
}
