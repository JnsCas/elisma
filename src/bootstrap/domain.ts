import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'

function initRepositories() {
  return {}
}

function initServices() {
  return {}
}

export async function registerDomain(container: ApplicationContainer) {
  container.register({
    ...initRepositories(),
    ...initServices(),
  })
}
