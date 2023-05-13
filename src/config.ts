import { number, string } from '@quorum/elisma/src/infra/configUtils'

/** Server options.
 */
type ServerConfig = {
  /** Current Node environment. */
  environment: string
  /** Host to bind the server to. Default is localhost. */
  host: string
  /** Port to bind the server to. */
  port: number
}

/** Current server configuration. */
export const server: ServerConfig = {
  environment: string('NODE_ENV'),
  host: string('SERVER_HOST'),
  port: number('SERVER_PORT'),
}

/** Open AI Config **/
type OpenAIConfig = {
  apiKey: string
}

export const openAIConfig: OpenAIConfig = {
  apiKey: string('OPEN_AI_API_KEY'),
}
