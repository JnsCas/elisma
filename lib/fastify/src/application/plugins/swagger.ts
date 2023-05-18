import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { FastifyInstance } from 'fastify'

export default function (app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Scraper Service API',
        description: 'Service to manage the integration with the Scraper Actor in Apify.',
        version: '1.0.0',
      },
    },
  })
  app.register(fastifySwaggerUi, {
    routePrefix: '/api-docs',
  })
}
