import { asClass } from 'awilix'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/elisma/src/infra/bootstrap'
import { HelloController } from '@quorum/lib/fastify/src/application/controllers/hello-data-source/HelloController'

const logger = createLogger('bootstrap:controllers')

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  logger.info('registering controllers and middlewares')
  container.register({
    helloController: asClass(HelloController).singleton(),
  })
})
