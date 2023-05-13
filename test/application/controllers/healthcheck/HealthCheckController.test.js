import { initTestApp } from '@quorum/elisma/test/support/testApp'

describe('HealthCheckController', () => {
  let app

  beforeAll(async () => {
    app = (await initTestApp()).app
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  test('returns a valid status response', async () => {
    const response = await app.inject({ method: 'get', url: '/api/v1/health-check' })
    expect(response.statusCode).toBe(200)
  })
})
