import { ApplicationRegistry } from '@quorum/elisma/src/infra/bootstrap'

describe('App Basics', function () {
  test('app starts successfully', async () => {
    ApplicationRegistry.addBootstrapDir('./src/bootstrap')

    const container = await ApplicationRegistry.initialize()
    const server = container.cradle.app
    expect(server).toBeTruthy()
    await server.close()
  })
})
