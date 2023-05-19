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
  /** Path to the frontend directory. */
  publicDir: string
  /** Path to the libraries directory. */
  libraryPath: string
  /** Output directory for generated projects. */
  outputPath: string
}

/** Current server configuration. */
export const server: ServerConfig = {
  environment: string('NODE_ENV'),
  host: string('SERVER_HOST'),
  port: number('SERVER_PORT'),
  publicDir: string('SERVER_PUBLIC_DIR'),
  libraryPath: string('LIBRARY_PATH'),
  outputPath: string('OUTPUT_PATH'),
}

/** Open AI Config **/
type OpenAIConfig = {
  apiKey: string
}

export const openAIConfig: OpenAIConfig = {
  apiKey: string('OPEN_AI_API_KEY'),
}
