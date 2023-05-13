import { CreateCompletionResponse, OpenAIApi } from 'openai'
import { Model } from '@quorum/elisma/src/domain/openai/entities/Model'
import { createLogger } from '@quorum/elisma/src/infra/log'

const logger = createLogger('OpenAIClient')

export class OpenAIClient {
  constructor(private readonly openAIApi: OpenAIApi) {}

  async createCompletion(prompt: string, model: Model = Model.DAVINCI): Promise<CreateCompletionResponse> {
    logger.info(`Creating completion with prompt ${prompt} and model ${model}...`)
    const completion = await this.openAIApi.createCompletion({
      model,
      prompt,
    })
    return completion.data
  }
}
