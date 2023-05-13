import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'
import { openAIConfig } from '@quorum/elisma/src/config'
import { asClass, asFunction } from 'awilix'
import { Configuration, OpenAIApi } from 'openai'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { OpenAIService } from '@quorum/elisma/src/domain/openai/OpenAIService'
import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'

function newOpenAIApi() {
  return new OpenAIApi(new Configuration(openAIConfig))
}

function initClients() {
  return {
    openAIApi: asFunction(newOpenAIApi).singleton(),
    openAIClient: asClass(OpenAIClient).singleton(),
  }
}

function initRepositories() {
  return {}
}

function initServices() {
  return {
    sessionService: asClass(SessionService).singleton(),
    openAIService: asClass(OpenAIService).singleton(),
  }
}

export async function registerDomain(container: ApplicationContainer) {
  container.register({
    ...initRepositories(),
    ...initClients(),
    ...initServices(),
  })
}
