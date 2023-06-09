import { asFunction, asValue } from 'awilix'
import Fastify, { FastifyInstance } from 'fastify'
import { CustomErrorHandler } from '@quorum/lib/fastify/src/infra/errors/CustomErrorHandler'
import swagger from '@quorum/lib/fastify/src/application/plugins/swagger'
import { register } from '@quorum/lib/fastify/src/application/controllers'
import { createWebLogger } from '@quorum/lib/pino/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/lib/elisma-loader/src/infra/bootstrap'
import { number, string } from '@quorum/lib/elisma-loader/src/infra/configUtils'

const logger = createWebLogger('web:elisma')

function newApp(container: ApplicationContainer): FastifyInstance {
  const app = Fastify({
    logger,
  })

  app.setErrorHandler(CustomErrorHandler)

  // Plugins
  swagger(app)

  app.register(
    async (router) => {
      await register(router, container)
    },
    { prefix: '/api/v1' }
  )

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
      app.listen({ port: number('SERVER_PORT'), host: string('SERVER_HOST') })
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
})
