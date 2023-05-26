import { asClass } from 'awilix'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/elisma/src/infra/bootstrap'
import { HealthCheckController } from '@quorum/elisma/src/application/controllers/healthcheck/HealthCheckController'
import { SessionController } from '@quorum/elisma/src/application/controllers/session/SessionController'
import { ZipController } from '@quorum/elisma/src/application/controllers/zip/ZipController'
import { LibraryController } from '@quorum/elisma/src/application/controllers/library/LibraryController'
import { LanguageController } from '@quorum/elisma/src/application/controllers/language/LanguageController'

const logger = createLogger('bootstrap:domain')

ApplicationRegistry.register(async function registerControllers(container: ApplicationContainer) {
  logger.info('registering controllers and middlewares')
  container.register({
    healthCheckController: asClass(HealthCheckController).singleton(),
    sessionController: asClass(SessionController).singleton(),
    zipController: asClass(ZipController).singleton(),
    languageController: asClass(LanguageController).singleton(),
    libraryController: asClass(LibraryController).singleton(),
  })
})
