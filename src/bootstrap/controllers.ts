import { asClass } from 'awilix'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'
import { HealthCheckController } from '@quorum/elisma/src/application/controllers/healthcheck/HealthCheckController'
import { SessionController } from '@quorum/elisma/src/application/controllers/session/SessionController'
import { OpenAIController } from '@quorum/elisma/src/application/controllers/openai/OpenAIController'
import { ZipController } from '@quorum/elisma/src/application/controllers/zip/ZipController'

const logger = createLogger('bootstrap:domain')

export async function registerControllers(container: ApplicationContainer) {
  logger.info('registering controllers and middlewares')
  container.register({
    healthCheckController: asClass(HealthCheckController).singleton(),
    sessionController: asClass(SessionController).singleton(),
    openAIController: asClass(OpenAIController).singleton(),
    zipController: asClass(ZipController).singleton(),
  })
}
