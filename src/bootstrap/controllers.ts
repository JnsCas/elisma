import { asClass } from 'awilix'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'
import { HealthCheckController } from '@quorum/elisma/src/application/controllers/healthcheck/HealthCheckController'

const logger = createLogger('bootstrap:domain')

export async function registerControllers(container: ApplicationContainer) {
  logger.info('registering controllers and middlewares')
  container.register({
    healthCheckController: asClass(HealthCheckController).singleton(),
  })
}
