import { fastifyRequestContext } from '@fastify/request-context'
import { FastifyInstance } from 'fastify'

export default function (app: FastifyInstance) {
  app.register(fastifyRequestContext)
}
