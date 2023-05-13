import { initApplication } from '@quorum/elisma/src/infra/bootstrap'
import { createLogger } from '@quorum/elisma/src/infra/log'
import { registerDomain } from '@quorum/elisma/src/bootstrap/domain'
import { registerServer } from '@quorum/elisma/src/bootstrap/server'
import { registerControllers } from '@quorum/elisma/src/bootstrap/controllers'
import { server as serverConfig } from '@quorum/elisma/src/config'

const logger = createLogger('bootstrap:init')

const start = async () => {
  const container = await initApplication([registerDomain, registerServer, registerControllers], [])
  const app = container.cradle.app

  try {
    logger.info(`NODE_ENV: ${serverConfig.environment}`)
    app.listen({ port: serverConfig.port, host: serverConfig.host })
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()
