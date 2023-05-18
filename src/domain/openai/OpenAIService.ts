import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { Session } from '@quorum/elisma/src/domain/session/entities/Session'
import {
  generateProjectPrompt,
  nameQuestionPrompt,
  receiveLanguagePrompt,
  receiveNamePrompt,
  requirementsQuestionPrompt,
} from '@quorum/elisma/src/domain/session/entities/Prompts'
import { ResourceNotFoundError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/ResourceNotFoundError'
import { Optional } from '@quorum/elisma/src/infra/Optional'
import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import { createPrompt } from '@quorum/elisma/src/domain/openai/ScaffoldingPrompt'
import { SupportedLibraries } from '@quorum/elisma/src/SupportedLibraries'
import { ChatCompletionResponse } from '@quorum/elisma/src/domain/openai/entities/ChatCompletionResponse'
import { createProgramLangPrompt } from '@quorum/elisma/src/domain/openai/ScaffoldingProgramLang'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { CompletionResponse } from '@quorum/elisma/src/domain/openai/entities/CompletionResponse'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

const logger = createLogger('OpenAIService')

export class OpenAIService {
  constructor(private readonly openAIClient: OpenAIClient, private readonly sessionService: SessionService) {}

  async receiveLanguage(session: Session, prompt: string) {
    session.addChatMessage(Role.USER, receiveLanguagePrompt())
    const { answer: selectedLanguage, message: firstMessage } = await this.sendChatCompletion(session, prompt)
    const language = selectedLanguage as ProjectLanguage
    if (!language) {
      logger.info(`The user did not select the language`)
      return firstMessage
    }
    session.setScaffolingLanguage(language)

    const { question: nextQuestion, message: secondMessage } = await this.sendChatCompletion(
      session,
      nameQuestionPrompt(session.getScaffolding)
    )
    if (!nextQuestion) {
      return secondMessage
    }
    return nextQuestion
  }

  async receiveName(session: Session, prompt: string) {
    const { answer: projectName } = await this.sendCompletion(receiveNamePrompt(prompt))
    if (!projectName) {
      logger.info(`The user did not select the project name`)
      throw new Error(projectName)
    }
    session.setScaffolingName(projectName)

    const { question: nextQuestion, message: secondMessage } = await this.sendChatCompletion(
      session,
      requirementsQuestionPrompt(session.getScaffolding)
    )

    if (!nextQuestion) {
      return secondMessage
    }
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

  async sendCompletion(prompt: string): Promise<CompletionResponse> {
    logger.info(`Sending prompt to completion Open AI...`)
    return await this.openAIClient.createCompletion(prompt)
  }

  async selectLibraries(session: Session, projectRequirements: string): Promise<LibraryDefinition[]> {
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
      .reduce((libraries: LibraryDefinition[], line) => {
        const fields = line.split('->')
        const category = fields[0]?.trim()
        const urls = fields[1]?.trim()?.match(urlRegex) || []
        const candidates = urls.map((url) => {
          const candidate = SupportedLibraries.find((library) => library.url === url)
          if (!candidate) {
            return LibraryDefinition.create(url, category, url)
          } else {
            return candidate
          }
        })

        return [...libraries, ...candidates]
      }, [])
  }

  async askProgrammingLanguage(): Promise<Optional<string>> {
    logger.info(`Asking programming language to the user...`)
    const session = this.sessionService.getById(RequestContextHolder.getContext().sessionId)
    if (!session) {
      throw new ResourceNotFoundError()
    }
    const { message } = await this.sendChatCompletion(session, createProgramLangPrompt())
    this.sessionService.update(session)
    return message
  }
}
