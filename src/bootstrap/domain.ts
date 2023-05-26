import { ApplicationContainer, ApplicationRegistry } from '@quorum/elisma/src/infra/bootstrap'
import { openAIConfig, server } from '@quorum/elisma/src/config'
import { asClass, asFunction } from 'awilix'
import { Configuration, OpenAIApi } from 'openai'
import { SessionService } from '@quorum/elisma/src/domain/session/SessionService'
import { OpenAIService } from '@quorum/elisma/src/domain/openai/OpenAIService'
import { OpenAIClient } from '@quorum/elisma/src/domain/openai/OpenAIClient'
import { SessionRepository } from '@quorum/elisma/src/domain/session/SessionRepository'
import { BundleService } from '@quorum/elisma/src/domain/bundle/BundleService'
import { DistributionService } from '@quorum/elisma/src/domain/bundle/DistributionService'
import { ManifestService } from '@quorum/elisma/src/domain/bundle/ManifestService'

function newOpenAIApi() {
  return new OpenAIApi(new Configuration(openAIConfig))
}

function newManifestService(): ManifestService {
  return new ManifestService(server.libraryPath)
}

function newBundleService(): BundleService {
  return new BundleService(server.libraryPath)
}

function newDistributionService(): DistributionService {
  return new DistributionService(server.outputPath)
}

function initClients() {
  return {
    openAIApi: asFunction(newOpenAIApi).singleton(),
    openAIClient: asClass(OpenAIClient).singleton(),
  }
}

function initRepositories() {
  return {
    sessionRepository: asClass(SessionRepository).singleton(),
  }
}

function initServices() {
  return {
    sessionService: asClass(SessionService).singleton(),
    openAIService: asClass(OpenAIService).singleton(),
    bundleService: asFunction(newBundleService),
    manifestService: asFunction(newManifestService),
    distributionService: asFunction(newDistributionService),
  }
}

ApplicationRegistry.register(async function registerDomain(container: ApplicationContainer) {
  container.register({
    ...initRepositories(),
    ...initClients(),
    ...initServices(),
  })
})
