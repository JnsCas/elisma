import { FastifyInstance } from 'fastify'
import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'
import { HealthCheckController } from '@quorum/elisma/src/application/controllers/healthcheck/HealthCheckController'
import { HEALTH_CHECK_OPTIONS } from '@quorum/elisma/src/application/controllers/healthcheck/schemas'
import { SessionController } from '@quorum/elisma/src/application/controllers/session/SessionController'
import { ZipController } from '@quorum/elisma/src/application/controllers/zip/ZipController'
import { DOWNLOAD_ZIP_OPTIONS } from '@quorum/elisma/src/application/controllers/zip/schemas'
import { LanguageController } from '@quorum/elisma/src/application/controllers/language/LanguageController'
import { LibraryController } from '@quorum/elisma/src/application/controllers/library/LibraryController'

/** Registers all restricted endpoints.
 * Public endpoints require authentication.
 * @param app {FastifyInstance} Current application.
 * @param container {ApplicationContainer} IoC container.
 */
export function register(app: FastifyInstance, container: ApplicationContainer) {
  const languageController: LanguageController = container.cradle.languageController
  app.get('/languages', {}, languageController.getAll.bind(languageController))

  const libraryController: LibraryController = container.cradle.libraryController
  app.get('/libs', {}, libraryController.getAll.bind(libraryController))

  const zipController: ZipController = container.cradle.zipController
  app.post('/zip', {}, zipController.generate.bind(zipController))
}

/** Registers all public endpoints.
 * Public endpoints don't require authentication.
 * @param app {FastifyInstance} Current application.
 * @param container {ApplicationContainer} IoC container.
 */
export function registerPublic(app: FastifyInstance, container: ApplicationContainer) {
  const healthCheckController: HealthCheckController = container.cradle.healthCheckController
  app.get('/health-check', HEALTH_CHECK_OPTIONS, healthCheckController.status.bind(healthCheckController))
  const sessionController: SessionController = container.cradle.sessionController
  app.post('/sessions', {}, sessionController.create.bind(sessionController))
  app.get('/sessions/:id', {}, sessionController.getById.bind(sessionController))

  const zipController: ZipController = container.cradle.zipController
  app.get('/download/:sessionId', DOWNLOAD_ZIP_OPTIONS, zipController.download.bind(zipController))
}
