import { FastifyInstance } from 'fastify'
import { PING_OPTIONS } from '@quorum/lib/fastify/src/application/controllers/schemas'
import { ApplicationContainer } from '@quorum/lib/elisma/src/infra/bootstrap'

/** Registers all endpoints.
 * @param app {FastifyInstance} Current application.
 * @param container {ApplicationContainer} IoC container.
 */
export function register(app: FastifyInstance, container: ApplicationContainer) {
  const helloController = container.resolve('helloController', { allowUnregistered: true })
  const mongoHelloController = container.resolve('mongoHelloController', { allowUnregistered: true })
  const postgresHelloController = container.resolve('postgresHelloController', { allowUnregistered: true })

  if (helloController) {
    app.get('/ping', PING_OPTIONS, helloController.ping.bind(helloController))
  }
  if (mongoHelloController) {
    app.get('/ping/mongo', PING_OPTIONS, mongoHelloController.ping.bind(mongoHelloController))
  }
  if (postgresHelloController) {
    app.get('/ping/postgres', PING_OPTIONS, postgresHelloController.ping.bind(postgresHelloController))
  }
}
