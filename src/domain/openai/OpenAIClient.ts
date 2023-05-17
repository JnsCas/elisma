import { CreateCompletionResponse, OpenAIApi } from 'openai'
import { Model } from '@quorum/elisma/src/domain/openai/entities/Model'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ChatMessage } from '@quorum/elisma/src/domain/openai/entities/ChatMessage'
import { ChatResponse } from '@quorum/elisma/src/domain/openai/entities/ChatResponse'

const logger = createLogger('OpenAIClient')

export class OpenAIClient {
  constructor(private readonly openAIApi: OpenAIApi) {}

  async createCompletion(prompt: string, model: Model = Model.DAVINCI): Promise<CreateCompletionResponse> {
    logger.info(`Creating completion with prompt ${prompt} and model ${model}...`)
    const { data } = await this.openAIApi.createCompletion({
      model,
      prompt,
    })
    return data
  }

  async createChatCompletion(messages: ChatMessage[], model: Model = Model.GPT_3_5_TURBO): Promise<ChatResponse> {
    logger.info(`Sending messages to Open AI chat completion...`)
    const { data } = await this.openAIApi.createChatCompletion({ model, messages, temperature: 2 })
    logger.info(`The response content from Open AI is ${data.choices[0].message?.content}`)
    return ChatResponse.restore(data)
  }
}
