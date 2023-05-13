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


/*
open ia devuelve una lista de packages: fastify, postgres, jest, vue,

output una lista de librerias y a partir de ahi decidir como construir


abstraccion de datasource

inicializar todo con awilix y despues usar solo el nombre
*/
