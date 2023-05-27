import { asFunction } from 'awilix'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma-loader/src/infra/bootstrap'
import { PostgresDataSource } from '@quorum/lib/postgres/src/infra/db/PostgresDataSource'
import { PostgresPingRepository } from '@quorum/lib/ping-domain/src/domain/pings/PostgresPingRepository'
import { PingService } from '@quorum/lib/ping-domain/src/domain/pings/PingService'
import { HelloController } from '@quorum/lib/express/src/application/controllers/hello/HelloController'

const logger = createLogger('bootstrap:controllers-postgres')

function newHelloController(postgresDataSource: PostgresDataSource): HelloController {
  const pingRepository = new PostgresPingRepository(postgresDataSource)
  const pingService = new PingService(pingRepository)
  return new HelloController(pingService)
}

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  logger.info('registering postgres controllers')
  container.register({
    postgresHelloController: asFunction(newHelloController).singleton(),
  })
})
