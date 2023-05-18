import { asFunction, asValue } from 'awilix'
import Fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { createWebLogger } from '@quorum/elisma/src/infra/log'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/elisma/src/infra/bootstrap'
import { CustomErrorHandler } from '@quorum/elisma/src/infra/errors/CustomErrorHandler'
import { register, registerPublic } from '@quorum/elisma/src/application/controllers'
import swagger from '@quorum/elisma/src/application/plugins/swagger'
import session from '@quorum/elisma/src/application/middlewares/session'
import cors from '@quorum/elisma/src/application/plugins/cors'
import fastifyRequestContext from '@quorum/elisma/src/application/plugins/fastifyRequestContext'
import staticFiles from '@quorum/elisma/src/application/plugins/staticFiles'
import { server as serverConfig } from '@quorum/elisma/src/config'

const logger = createWebLogger('web:elisma')

function newApp(container: ApplicationContainer): FastifyInstance {
  const app = Fastify({
    logger,
  })

  app.setErrorHandler(CustomErrorHandler)

  // Plugins
  swagger(app)
  cors(app)
  fastifyRequestContext(app)
  staticFiles(app)

  app.register(
    async (router) => {
      await registerPublic(router, container)
    },
    { prefix: '/api/v1' }
  )

  // Register routers for restricted controllers
  app.register(
    async (router) => {
      router.addHook('onRequest', async (request: FastifyRequest) => {
        await session(request, container.cradle.sessionService)
      })
      await register(router, container)
    },
    { prefix: '/api/v1' }
  )

  return app
}

ApplicationRegistry.register(async function registerServer(container: ApplicationContainer) {
  container.register({
    app: asFunction(newApp).singleton(),
    container: asValue(container),
  })

  container.onStart(async () => {
    const app = container.cradle.app

    try {
      logger.info(`NODE_ENV: ${serverConfig.environment}`)
      app.listen({ port: serverConfig.port, host: serverConfig.host })
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
})
