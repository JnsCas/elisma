import { asFunction, asValue } from 'awilix'
import Fastify, { FastifyInstance } from 'fastify'
import { createWebLogger } from '@quorum/elisma/src/infra/log'
import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'
import { CustomErrorHandler } from '@quorum/elisma/src/infra/errors/CustomErrorHandler'
import { register } from '@quorum/elisma/src/application/controllers'
import swagger from '@quorum/elisma/src/application/plugins/swagger'

const logger = createWebLogger('web:elisma')

function newApp(container: ApplicationContainer): FastifyInstance {
  const app = Fastify({
    logger,
  })

  app.setErrorHandler(CustomErrorHandler)

  // Plugins
  swagger(app)

  // Register routers for public and restricted controllers
  app.register(
    async (router) => {
      await register(router, container)
    },
    { prefix: '/api/v1' }
  )

  return app
}

export async function registerServer(container: ApplicationContainer) {
  container.register({
    app: asFunction(newApp).singleton(),
    container: asValue(container),
  })
}
