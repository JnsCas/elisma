import { initTestApp } from '@quorum/elisma/test/support/testApp'
import { RequestContextHolder } from '@quorum/elisma/src/infra/context/RequestContextHolder'
import { ElismaRequestContext } from '@quorum/elisma/src/infra/context/ElismaRequestContext'
import { Session } from '@quorum/elisma/src/domain/session/entities/Session'

describe('OpenAIService', () => {
  let container

  beforeAll(async () => {
    const context = await initTestApp()
    container = context.container
  })

  afterAll(async () => {
    if (container) {
      await container.close()
    }
  })

  test('selects a list of libraries', async () => {
    const session = Session.create()
    const sessionRepository = container.cradle.sessionRepository
    const context = new ElismaRequestContext(sessionRepository.save(session))
    RequestContextHolder.getContext = () => context

    const service = container.cradle.openAIService
    const libraries = await service.selectLibraries(
      session,
      'I need to build a CLI application. It will generate a set of reports in CSV from a database. The database can be postgres or mongo.'
    )
    expect(libraries.length).toBeTruthy()
  })
})