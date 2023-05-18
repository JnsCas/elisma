import { FastifyInstance } from 'fastify'
import { ApplicationContainer, ApplicationRegistry } from '@quorum/elisma/src/infra/bootstrap'

export async function initTestApp(): Promise<{ app: FastifyInstance; container: ApplicationContainer }> {
  ApplicationRegistry.addBootstrapDir('./src/bootstrap')

  const start = Date.now()
  const container = await ApplicationRegistry.initialize()

  const app: FastifyInstance = container.cradle.app
  app.log.info(`app ready, took ${Date.now() - start}ms`)

  Object.assign(container, {
    async close() {
      await container.cradle.dataSource.shutdown()
    },
  })

  return { app, container }
}
