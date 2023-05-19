import { OpenAIApi } from 'openai'
import { Model } from '@quorum/elisma/src/domain/openai/entities/Model'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ChatMessage } from '@quorum/elisma/src/domain/openai/entities/ChatMessage'
import { ChatCompletionResponse } from '@quorum/elisma/src/domain/openai/entities/ChatCompletionResponse'
import { CompletionResponse } from '@quorum/elisma/src/domain/openai/entities/CompletionResponse'

const logger = createLogger('OpenAIClient')

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
    model: Model = Model.GPT_3_5_TURBO
  ): Promise<ChatCompletionResponse> {
    logger.info(`Sending messages to Open AI chat completion...`)
    const { data } = await this.openAIApi.createChatCompletion({ model, messages, temperature: 1 })
    logger.info(`The response content from Open AI is ${data.choices[0].message?.content}`)
    return ChatCompletionResponse.restore(data)
  }
}
