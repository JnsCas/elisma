import { requestContext } from '@fastify/request-context'
import { ElismaRequestContext } from '@quorum/elisma/src/infra/context/ElismaRequestContext'

const ELISMA_REQUEST_CONTEXT = 'elismaRequestContext'

export class RequestContextHolder {
  static init(elismaRequestContext: ElismaRequestContext) {
    requestContext.set(ELISMA_REQUEST_CONTEXT, elismaRequestContext)
  }

  static getContext(): ElismaRequestContext {
    return requestContext.get(ELISMA_REQUEST_CONTEXT)
  }
}
