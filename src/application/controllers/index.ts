import { FastifyInstance } from 'fastify'
import { ApplicationContainer } from '@quorum/elisma/src/infra/bootstrap'
import { HealthCheckController } from '@quorum/elisma/src/application/controllers/healthcheck/HealthCheckController'
import { HEALTH_CHECK_OPTIONS } from '@quorum/elisma/src/application/controllers/healthcheck/schemas'
import { SessionController } from '@quorum/elisma/src/application/controllers/session/SessionController'
import { OpenAIController } from '@quorum/elisma/src/application/controllers/openai/OpenAIController'
import { POST_OPENAI_OPTIONS } from '@quorum/elisma/src/application/controllers/openai/schemas'

/** Registers all restricted endpoints.
 * Public endpoints require authentication.
 * @param app {FastifyInstance} Current application.
 * @param container {ApplicationContainer} IoC container.
 */
export function register(app: FastifyInstance, container: ApplicationContainer) {
  const openAIController: OpenAIController = container.cradle.openAIController
  app.post('/openai/completion', POST_OPENAI_OPTIONS, openAIController.sendCompletion.bind(openAIController))
  app.post('/openai/chat-completion', POST_OPENAI_OPTIONS, openAIController.sendChatCompletion.bind(openAIController))
  app.post('/openai/select-libraries', POST_OPENAI_OPTIONS, openAIController.selectLibraries.bind(openAIController))
  app.post('/openai/chat-completion/messages', {}, openAIController.sendChatCompletionMessages.bind(openAIController))
}

/** Registers all public endpoints.
 * Public endpoints don't require authentication.
 * @param app {FastifyInstance} Current application.
 * @param container {ApplicationContainer} IoC container.
 */
export function registerPublic(app: FastifyInstance, container: ApplicationContainer) {
  const healthCheckController: HealthCheckController = container.cradle.healthCheckController
  app.get('/health-check', HEALTH_CHECK_OPTIONS, healthCheckController.status.bind(healthCheckController))
  const sessionController: SessionController = container.cradle.sessionController
  app.post('/sessions', {}, sessionController.create.bind(sessionController))
  app.get('/sessions/:id', {}, sessionController.getById.bind(sessionController))
}
