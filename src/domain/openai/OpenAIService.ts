import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { ResourceNotFoundError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/ResourceNotFoundError'
import { ChatCompletionResponseMessage } from 'openai'
import { Optional } from '@quorum/elisma/src/infra/Optional'
import { Library } from '@quorum/elisma/src/domain/scaffolding/entities/Library'
import { createPrompt } from '@quorum/elisma/src/domain/openai/ScaffoldingPrompt'
import { SupportedLibraries } from '@quorum/elisma/src/SupportedLibraries'
import { createProgramLangPrompt } from './ScaffoldingProgramLang'

const logger = createLogger('OpenAIService')

export class OpenAIService {
  constructor(private readonly openAIClient: OpenAIClient, private readonly sessionService: SessionService) {}

  async sendCompletion(prompt: string) {
    logger.info(`Sending prompt to completion Open AI...`)
    return await this.openAIClient.createCompletion(prompt)
  }

  async sendChatCompletion(prompt: string): Promise<Optional<ChatCompletionResponseMessage>> {
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

  async selectLibraries(projectRequirements: string): Promise<Library[]> {
    const prompt = createPrompt(SupportedLibraries, projectRequirements)
    const message = await this.sendChatCompletion(prompt)
    const urlRegex = /(https?:\/\/[^\s]+)/g

    if (!message) {
      throw new Error('no response from model')
    }

    const lines = message.content.split('\n')
    if (!lines.length || !lines.some((line) => line.includes('->'))) {
      throw new Error('invalid response from model')
    }

    return lines
      .map((line) => line.trim())
      .filter((line) => line.includes('->'))
      .reduce((libraries: Library[], line) => {
        const fields = line.split('->')
        const category = fields[0]?.trim()
        const urls = fields[1]?.trim()?.match(urlRegex) || []
        const candidates = urls.map((url) => {
          const candidate = SupportedLibraries.find((library) => library.url === url)
          if (!candidate) {
            return Library.create(url, category, url)
          } else {
            return candidate
          }
        })

        return [...libraries, ...candidates]
      }, [])
  }
  
  async askProgrammingLanguage(): Promise<Optional<ChatCompletionResponseMessage>> {
    logger.info(`Asking programming language to the user...`)
    const session = this.sessionService.getById(RequestContextHolder.getContext().sessionId)
    if (!session) {
      throw new ResourceNotFoundError()
    }
    session.addChatMessage(Role.USER, createProgramLangPrompt())
    const chatCompletionResponse = await this.openAIClient.createChatCompletion(session.messages)
    const messageResponse = chatCompletionResponse.choices[0].message
    if (messageResponse) {
      session.addChatMessage(messageResponse.role as Role, messageResponse.content)
    }
    this.sessionService.update(session)
    return messageResponse
  }

}
