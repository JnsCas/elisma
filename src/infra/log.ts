import { isDev, logging } from '@quorum/elisma/src/infra/config'
import { Logger, pino } from 'pino'
import pretty from 'pino-pretty'

/** HTTP request fields that will be hidden from the logs. */
const WEB_REDACTED_FIELDS = ['req.headers.authorization', 'req.headers.cookie']

/** Creates a logger with the specified prefix.
 *
 * The log lever is configured using the SERVER_LOG_LEVEL environment variable.
 *
 * @param prefix {string} Prefix to prepend to all messages.
 * @param options Pino logger additional options.
 * @returns the new logger.
 */
export function createLogger(prefix: string, options: any = {}): Logger {
  const prettyStream = pretty({
    colorize: true,
    sync: true,
    singleLine: true,
  })

  return pino(
    {
      name: prefix,
      timestamp: pino.stdTimeFunctions.isoTime,
      level: logging.level,
      ...options,
    },
    isDev() ? prettyStream : process.stdout
  )
}

/** Creates a logger for a web application.
 * @param prefix Logger name.
 * @return the new logger.
 */
export function createWebLogger(prefix: string): Logger {
  return createLogger(prefix, {
    redact: WEB_REDACTED_FIELDS,
    serializers: {
      res(reply: any) {
        return { statusCode: reply.statusCode }
      },
      req(request: any) {
        return {
          method: request.method,
          url: request.url,
          headers: request.headers,
          hostname: request.hostname,
        }
      },
    },
  })
}
