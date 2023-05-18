import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { FastifyInstance } from 'fastify'

export default function (app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'El IsmA API',
        description: 'El IsmA',
        version: '1.0.0',
      },
    },
  })
  app.register(fastifySwaggerUi, {
    routePrefix: '/api-docs',
  })
}
