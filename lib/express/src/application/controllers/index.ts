import { ApplicationContainer } from '@quorum/lib/elisma-loader/src/infra/bootstrap'
import { IRouter } from 'express'
import { endpoint } from '@quorum/lib/express/src/infra/RouteUtils'

export function register(app: IRouter, container: ApplicationContainer) {
  const helloController = container.resolve('helloController', { allowUnregistered: true })
  const mongoHelloController = container.resolve('mongoHelloController', { allowUnregistered: true })
  const postgresHelloController = container.resolve('postgresHelloController', { allowUnregistered: true })

  if (helloController) {
    app.get('/ping', endpoint(helloController.ping.bind(helloController)))
  }
  if (mongoHelloController) {
    app.get('/ping/mongo', endpoint(mongoHelloController.ping.bind(mongoHelloController)))
  }
  if (postgresHelloController) {
    app.get('/ping/postgres', endpoint(postgresHelloController.ping.bind(postgresHelloController)))
  }
}
