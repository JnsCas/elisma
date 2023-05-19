import { asClass } from 'awilix'
import { HelloController } from '@quorum/lib/fastify/src/application/controllers/hello-data-source/HelloController'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma/src/infra/bootstrap'

const logger = createLogger('bootstrap:controllers')

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  logger.info('registering controllers and middlewares')
  container.register({
    helloController: asClass(HelloController).singleton(),
  })
})
