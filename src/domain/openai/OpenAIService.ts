import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { Role } from '@quorum/elisma/src/domain/openai/entities/Role'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { Session } from '@quorum/elisma/src/domain/session/entities/Session'
import {
  createProgramLangPrompt,
  generateProjectPrompt,
  nameQuestionPrompt,
  receiveLanguagePrompt,
  receiveNamePrompt,
  requirementsQuestionPrompt,
  retryProgramLangPrompt,
  retryPrompt,
  sayGoodByePrompt,
} from '@quorum/elisma/src/domain/session/entities/Prompts'
import { ResourceNotFoundError } from '@quorum/elisma/src/infra/errors/genericHttpErrors/ResourceNotFoundError'
import { Optional } from '@quorum/elisma/src/infra/Optional'
import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import { SupportedLibraries } from '@quorum/elisma/src/SupportedLibraries'
import { ChatCompletionResponse } from '@quorum/elisma/src/domain/openai/entities/ChatCompletionResponse'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { CompletionResponse } from '@quorum/elisma/src/domain/openai/entities/CompletionResponse'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

const logger = createLogger('OpenAIService')

const MAX_TRIES = 3

export class OpenAIService {
  constructor(private readonly openAIClient: OpenAIClient, private readonly sessionService: SessionService) {}

  async askProgrammingLanguage(): Promise<Optional<string>> {
    logger.info(`Asking programming language to the user...`)
    const session = this.sessionService.getById(RequestContextHolder.getContext().sessionId)
    if (!session) {
      throw new ResourceNotFoundError()
    }
    const { question } = await this.sendChatCompletion(session, createProgramLangPrompt())
    this.sessionService.update(session)
    return question
  }

  async receiveLanguage(session: Session, prompt: string) {
    session.addChatMessage(Role.USER, receiveLanguagePrompt())
    const { answer } = await this.sendChatCompletion(session, prompt)
    if (!answer) {
      throw new Error()
    }
    if (!this.isValidLanguage(answer)) {
      const { answer } = await this.sendChatCompletion(session, retryProgramLangPrompt(prompt))
      return answer
    }
    const language = answer as ProjectLanguage
    session.setScaffolingLanguage(language)

    const { question: nextQuestion } = await this.sendChatCompletion(
      session,
      nameQuestionPrompt(session.getScaffolding)
    )
    return nextQuestion
  }

  async receiveName(session: Session, prompt: string) {
    const { answer: projectName } = await this.sendChatCompletion(session, receiveNamePrompt(prompt))
    if (!projectName) {
      logger.info(`The user did not select the project name`)
      throw new Error(projectName)
    }
    session.setScaffolingName(projectName)

    const { question: nextQuestion } = await this.sendChatCompletion(
      session,
      requirementsQuestionPrompt(session.getScaffolding)
    )
    return nextQuestion
  }

  async receiveRequirements(session: Session, prompt: string) {
    session.addChatMessage(Role.USER, prompt) //adding this just in case
    session.setScaffolingRequirements(prompt)
    const { libraries } = await this.sendChatCompletion(session, generateProjectPrompt(session.getScaffolding))
    if (!libraries) {
      throw new Error()
    }
    let selectedLibraries = this.filterSupportedLibraries(libraries)

    //workaround
    const MAX_RETRIES = 2
    let retries = 0
    while (selectedLibraries.length === 0 && retries < MAX_RETRIES) {
      logger.info(`Retrying libraries project ${retries + 1}/${MAX_RETRIES}...`)
      const { libraries } = await this.sendChatCompletion(session, generateProjectPrompt(session.getScaffolding))
      if (!libraries) {
        throw new Error()
      }
      selectedLibraries = this.filterSupportedLibraries(libraries)
      retries = retries + 1
    }
    //

    if (selectedLibraries.length === 0) {
      logger.info(`Selecting all the libraries as default...`)
      selectedLibraries.push(...SupportedLibraries)
    }
    session.setScaffoldingSelectedLibraries(selectedLibraries)

    const { answer } = await this.sendChatCompletion(session, sayGoodByePrompt())
    return answer
  }

  async sendChatCompletion(session: Session, prompt: string, tryNumber = 0): Promise<ChatCompletionResponse> {
    logger.info(`Sending prompt ${prompt} to Open AI chat completion...`)
    session.addChatMessage(Role.USER, prompt)
    try {
      return await this.openAIClient.createChatCompletion(session.messages)
    } catch (e) {
      if (e instanceof SyntaxError) {
        if (tryNumber < MAX_TRIES) {
          const nextTryNumber = tryNumber + 1
          logger.info(`Error parsing Open AI response, trying again ${nextTryNumber + 1}/${MAX_TRIES}...`)
          return await this.sendChatCompletion(session, retryPrompt(prompt), nextTryNumber)
        } else {
          logger.info(`Error parsing Open AI response`, e)
          throw e
        }
      }
      throw e
    }
  }

  async sendCompletion(prompt: string): Promise<CompletionResponse> {
    logger.info(`Sending prompt to completion Open AI...`)
    return await this.openAIClient.createCompletion(prompt)
  }

  private isValidLanguage(language: string): boolean {
    return Object.values(ProjectLanguage).includes(language.toLowerCase() as ProjectLanguage)
  }

  private filterSupportedLibraries(candidateLibraries: string[]) {
    return SupportedLibraries.filter((supportedLibrary: LibraryDefinition) =>
      candidateLibraries.some((name: string) => name === supportedLibrary.packageName)
    )
  }
}
