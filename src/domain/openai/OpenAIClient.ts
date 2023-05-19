import { OpenAIApi } from 'openai'
import { Model } from '@quorum/elisma/src/domain/openai/entities/Model'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ChatMessage } from '@quorum/elisma/src/domain/openai/entities/ChatMessage'
import { ChatCompletionResponse } from '@quorum/elisma/src/domain/openai/entities/ChatCompletionResponse'
import { CompletionResponse } from '@quorum/elisma/src/domain/openai/entities/CompletionResponse'

const logger = createLogger('OpenAIClient')

const MAX_RETRIES = 2

export class OpenAIClient {
  constructor(private readonly openAIApi: OpenAIApi) {}

  async createCompletion(prompt: string, model: Model = Model.DAVINCI): Promise<CompletionResponse> {
    logger.info(`Creating completion with prompt ${prompt} and model ${model}...`)
    const { data } = await this.openAIApi.createCompletion({
      model,
      prompt,
    })
    return CompletionResponse.restore(data)
  }

  async createChatCompletion(
    messages: ChatMessage[],
    model: Model = Model.GPT_3_5_TURBO,
    retries = 0
  ): Promise<ChatCompletionResponse> {
    logger.info(`Sending messages to Open AI chat completion...`)
    let response
    try {
      response = await this.openAIApi.createChatCompletion({ model, messages, temperature: 1 })
      logger.info(`The response content from Open AI is ${response.data.choices[0].message?.content}`)
    } catch (e) {
      if (retries < MAX_RETRIES) {
        logger.info(`Retrying Open AI chat completion ${retries + 1}/${MAX_RETRIES}...`)
        await new Promise((resolve) => setTimeout(resolve, 500))
        return await this.createChatCompletion(messages, Model.GPT_3_5_TURBO, retries + 1)
      }
      throw e
    }
    return ChatCompletionResponse.restore(response.data)
  }
}
