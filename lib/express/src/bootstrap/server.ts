import { asFunction, asValue } from 'awilix'
import { register } from '@quorum/lib/express/src/application/controllers'
import { createWebLogger } from '@quorum/lib/pino/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma-loader/src/infra/bootstrap'
import { number, string } from '@quorum/lib/elisma-loader/src/infra/configUtils'
import express, { Express, Router } from 'express'

const logger = createWebLogger('web:elisma')

function newApp(container: ApplicationContainer): Express {
  const app = express()
  const api = Router()

  register(api, container)
  app.use('/api/v1', api)

  return app
}

ApplicationRegistry.register(async function (container: ApplicationContainer) {
  container.register({
    app: asFunction(newApp).singleton(),
    container: asValue(container),
  })

  container.onStart(async () => {
    const app = container.cradle.app

    try {
      logger.info(`NODE_ENV: ${process.env.NODE_ENV}`)
      const host = string('SERVER_HOST')
      const port = number('SERVER_PORT')
      app.listen(port, host, () => logger.info(`Application started at: ${host}:${port}`))
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
})
