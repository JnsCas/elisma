import { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import { ifNotDev } from '@quorum/elisma/src/infra/config'

export default function (app: FastifyInstance) {
  app.register(
    fastifyCors,
    ifNotDev(() => {
      return { origin: /^https?:\/\/localhost(:\d+)?$/ }
    })
  )
}
