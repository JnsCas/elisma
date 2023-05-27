import { asFunction } from 'awilix'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma-loader/src/infra/bootstrap'
import { HelloController } from '@quorum/lib/express/src/application/controllers/hello/HelloController'
import { PingService } from '@quorum/lib/ping-domain/src/domain/pings/PingService'
import { InMemoryPingRepository } from '@quorum/lib/ping-domain/src/domain/pings/InMemoryPingRepository'

const logger = createLogger('bootstrap:controllers')

function newHelloController(): HelloController {
  const pingRepository = new InMemoryPingRepository()
  const pingService = new PingService(pingRepository)
  return new HelloController(pingService)
}

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  logger.info('registering controllers and middlewares')
  container.register({
    helloController: asFunction(newHelloController).singleton(),
  })
})
