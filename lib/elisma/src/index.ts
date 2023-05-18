import { ApplicationRegistry } from '@quorum/lib/elisma/src/infra/bootstrap'
import { createLogger } from '@quorum/lib/pino/src/infra/log'

const logger = createLogger('bootstrap:init')

const start = async () => {
  logger.info('starting application')
  ApplicationRegistry.addBootstrapDir('./src/bootstrap')
  await ApplicationRegistry.initialize()
}

start()
