import { asFunction } from 'awilix'
import { Pool } from 'pg'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma/src/infra/bootstrap'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { PostgresDataSource } from '@quorum/lib/postgres/src/infra/db/PostgresDataSource'
import { string } from '@quorum/lib/elisma/src/infra/configUtils'

const logger = createLogger('bootstrap:dataSource')

function newPostgresDataSource(): PostgresDataSource {
  const connectionString = string('DB_POSTGRES_CONNECTION_STRING')

  logger.info(`initializing data source: connectionString=${connectionString}`)

  return new PostgresDataSource(
    new Pool({
      connectionString,
      idleTimeoutMillis: 0,
    })
  )
}

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  logger.info('registering postgres data sources')

  container.register({
    postgresDataSource: asFunction(newPostgresDataSource).singleton(),
  })
})
