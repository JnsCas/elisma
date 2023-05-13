import { FastifyInstance } from 'fastify'
import { ApplicationContainer, initApplication } from '@quorum/elisma/src/infra/bootstrap'
import { registerDataSource } from '@quorum/elisma/src/bootstrap/dataSource'
import { registerDomain } from '@quorum/elisma/src/bootstrap/domain'
import { registerServer } from '@quorum/elisma/src/bootstrap/server'
import { registerControllers } from '@quorum/elisma/src/bootstrap/controllers'

export async function initTestApp(): Promise<{ app: FastifyInstance; container: ApplicationContainer }> {
  const start = Date.now()
  const container = await initApplication([registerDataSource, registerDomain, registerServer, registerControllers], [])
  const app: FastifyInstance = container.cradle.app
  app.log.info(`app ready, took ${Date.now() - start}ms`)

  Object.assign(container, {
    async close() {
      await container.cradle.dataSource.shutdown()
    },
  })

  return { app, container }
}
