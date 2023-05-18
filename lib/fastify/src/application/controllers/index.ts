import { FastifyInstance } from 'fastify'
import { PING_OPTIONS } from '@quorum/lib/fastify/src/application/controllers/schemas'
import { ApplicationContainer } from '@quorum/lib/elisma/src/infra/bootstrap'

/** Registers all endpoints.
 * @param app {FastifyInstance} Current application.
 * @param container {ApplicationContainer} IoC container.
 */
export function register(app: FastifyInstance, container: ApplicationContainer) {
  const helloController = container.cradle.helloController
  app.get('/ping', PING_OPTIONS, helloController.ping.bind(helloController))
}
