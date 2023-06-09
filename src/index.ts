import { ApplicationRegistry } from '@quorum/elisma/src/infra/bootstrap'
import { createLogger } from '@quorum/elisma/src/infra/log'

const logger = createLogger('bootstrap:init')

const start = async () => {
  logger.info('starting application')
  ApplicationRegistry.addBootstrapDir('./src/bootstrap')
  await ApplicationRegistry.initialize()
}

start()
