import { optString } from '@quorum/elisma/src/infra/configUtils'

export const isDev = () => {
  return process.env.NODE_ENV === 'development'
}

/** Builds configuration only if the current environment is development.
 * If the environment is not development, it returns an empty object.
 *
 * @param callback Factory function to build the configuration object.
 * @return the new configuration or an empty object depending on the environment.
 */
export function ifDev(callback: () => object): object {
  if (isDev()) {
    return callback()
  } else {
    return {}
  }
}

/** Builds configuration only if the current environment is not development.
 * If the environment is development, it returns an empty object.
 *
 * @param callback Factory function to build the configuration object.
 * @return the new configuration or an empty object depending on the environment.
 */
export function ifNotDev(callback: () => object): object {
  if (!isDev()) {
    return callback()
  } else {
    return {}
  }
}

/** Logging configuration.
 */
type Logging = {
  /** One of the supported log levels. Might be one the following levels from less to max verbose:
   *
   * 'fatal'
   * 'error'
   * 'warn'
   * 'info'
   * 'debug'
   * 'trace'
   */
  level: string
}

/** Default region if no region is specified in operations that depend on the region. */
export const defaultRegion = 'united states'

export const logging: Logging = {
  level: optString('SERVER_LOG_LEVEL') || 'info',
}
