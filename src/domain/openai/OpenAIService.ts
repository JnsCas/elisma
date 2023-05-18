import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { Session } from '@quorum/elisma/src/domain/session/entities/Session'
import { Language } from '@quorum/elisma/src/domain/scaffolding/entities/Language'
import { generateProjectPrompt } from '@quorum/elisma/src/domain/session/entities/Prompts'
import { createPrompt } from '@quorum/elisma/src/domain/openai/ScaffoldingPrompt'
import { SupportedLibraries } from '@quorum/elisma/src/SupportedLibraries'
import { Library } from '@quorum/elisma/src/domain/scaffolding/entities/Library'
import { ChatCompletionResponse } from '@quorum/elisma/src/domain/openai/entities/ChatCompletionResponse'

const logger = createLogger('OpenAIService')

export class OpenAIService {
  constructor(private readonly openAIClient: OpenAIClient, private readonly sessionService: SessionService) {}

  async receiveLanguage(session: Session, prompt: string) {
    const { answer, question: nextQuestion, message } = await this.sendChatCompletion(session, prompt)
    const language = answer as Language
    if (!language) {
      logger.info(`The user did not select the language`)
      return message
    }
    session.setScaffolingLanguage(language)
    return nextQuestion
  }

  async receiveName(session: Session, prompt: string) {
    const { answer: projectName, question: nextQuestion, message } = await this.sendChatCompletion(session, prompt)
    if (!projectName) {
      logger.info(`The user did not select the project name`)
      return message
    }
    session.setScaffolingName(projectName)
    return nextQuestion
  }

  async receiveRequirements(session: Session, prompt: string) {
    session.addChatMessage(Role.USER, prompt) //adding this just in case
    const { message } = await this.sendChatCompletion(session, generateProjectPrompt())
    session.setScaffolingRequirements(prompt)
    //TODO (jns) hardcodeo
    session.setScaffoldingSelectedLibraries(
      SupportedLibraries.filter(
        (library) =>
          library.packageName === 'express' ||
          library.packageName === 'fastify' ||
          library.packageName === 'jest' ||
          library.packageName === 'mongo'
      )
    )
    return message
  }

  async sendChatCompletion(session: Session, prompt: string): Promise<ChatCompletionResponse> {
    logger.info(`Sending prompt ${prompt} to Open AI chat completion...`)
    session.addChatMessage(Role.USER, prompt)
    return await this.openAIClient.createChatCompletion(session.messages)
  }

  async sendCompletion(prompt: string) {
    logger.info(`Sending prompt to completion Open AI...`)
    return await this.openAIClient.createCompletion(prompt)
  }

  async selectLibraries(session: Session, projectRequirements: string): Promise<Library[]> {
    const prompt = createPrompt(SupportedLibraries, projectRequirements)
    const { message } = await this.sendChatCompletion(session, prompt)
    const urlRegex = /(https?:\/\/[^\s]+)/g

    if (!message) {
      throw new Error('no response from model')
    }

    const lines = message.split('\n')
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
}
