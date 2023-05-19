import { asFunction } from 'awilix'
import { HelloController } from '@quorum/lib/fastify/src/application/controllers/hello-mongo/HelloController'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma/src/infra/bootstrap'
import { PingService } from '@quorum/lib/fastify/src/domain/pings/PingService'
import { MongoPingRepository } from '@quorum/lib/fastify/src/domain/pings/MongoPingRepository'
import { MongoDataSource } from '@quorum/lib/mongo/src/infra/db/mongo/MongoDataSource'

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
