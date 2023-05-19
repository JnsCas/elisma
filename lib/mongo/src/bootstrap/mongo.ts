import { asFunction } from 'awilix'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma/src/infra/bootstrap'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { string } from '@quorum/lib/elisma/src/infra/configUtils'
import { MongoDataSource } from '@quorum/lib/mongo/src/infra/db/mongo/MongoDataSource'

const logger = createLogger('bootstrap:dataSource')

function newMongoDataSource(): MongoDataSource {
  const connectionString = string('DB_MONGO_CONNECTION_STRING')

  logger.info(`initializing data source: connectionString=${connectionString}`)
  return new MongoDataSource(connectionString)
}

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  logger.info('registering mongo data sources')

  container.register({
    mongoDataSource: asFunction(newMongoDataSource).singleton(),
  })
})
