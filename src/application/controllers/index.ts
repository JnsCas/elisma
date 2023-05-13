import { FastifyInstance } from 'fastify'
import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'
import { HealthCheckController } from '@quorum/elisma/src/application/controllers/healthcheck/HealthCheckController'
import { HEALTH_CHECK_OPTIONS } from '@quorum/elisma/src/application/controllers/healthcheck/schemas'

/** Registers all public endpoints.
 * Public endpoints don't require authentication.
 * @param app {FastifyInstance} Current application.
 * @param container {ApplicationContainer} IoC container.
 */
export function register(app: FastifyInstance, container: ApplicationContainer) {
  const healthCheckController: HealthCheckController = container.cradle.healthCheckController
  app.get('/health-check', HEALTH_CHECK_OPTIONS, healthCheckController.status)
}
