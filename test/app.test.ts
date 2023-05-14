import { initApplication } from '@quorum/elisma/src/infra/bootstrap'
import { registerDomain } from '@quorum/elisma/src/bootstrap/domain'
import { registerServer } from '@quorum/elisma/src/bootstrap/server'
import { registerControllers } from '@quorum/elisma/src/bootstrap/controllers'

describe('App Basics', function () {
  test('app starts successfully', async () => {
    const container = await initApplication([registerDomain, registerServer, registerControllers], [])
    const server = container.cradle.app
    expect(server).toBeTruthy()
    await server.close()
  })
})
