import { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'

export default function (app: FastifyInstance) {
  app.register(fastifyCors, {
    exposedHeaders: 'Content-Disposition',
  })
}
