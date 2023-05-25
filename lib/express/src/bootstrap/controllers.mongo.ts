import { asFunction } from 'awilix'
import { HelloController } from '@quorum/lib/express/src/application/controllers/hello/HelloController'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma-loader/src/infra/bootstrap'
import { MongoDataSource } from '@quorum/lib/mongo/src/infra/db/mongo/MongoDataSource'
import { MongoPingRepository } from '@quorum/lib/ping-domain/src/domain/pings/MongoPingRepository'
import { PingService } from '@quorum/lib/ping-domain/src/domain/pings/PingService'

const logger = createLogger('bootstrap:controllers-mongo')

function newHelloController(mongoDataSource: MongoDataSource): HelloController {
  const pingRepository = new MongoPingRepository(mongoDataSource)
  const pingService = new PingService(pingRepository)
  return new HelloController(pingService)
}

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  logger.info('registering mongo controllers')
  container.register({
    mongoHelloController: asFunction(newHelloController).singleton(),
  })
})
