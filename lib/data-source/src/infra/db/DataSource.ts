import { createLogger } from '@quorum/lib/pino/src/infra/log'

const logger = createLogger('DataSource')

/** This class provides an abstraction to run operations in the context of a data source connection.
 *
 * Implementations must override the openConnection() and releaseConnection() methods.
 */
export abstract class DataSource<ConnectionType> {
  /** Calls a function with a data source connection.
   *
   * This method retrieves a connection using the openConnection() method and then it invokes the callback
   * providing the connection. Once finished, it releases the connection using the releaseConnection() method.
   *
   * If there is any error within the callback, the connection is still released.
   *
   * @param callback {connection: ConnectionType => T | Promise<T>}
   * @returns {Promise<T>}
   */
  async runWithConnection<T>(callback: (connection: ConnectionType) => T | Promise<T>): Promise<T> {
    let connection
    try {
      connection = await this.openConnection()
    } catch (cause: any) {
      logger.error(cause, 'error acquiring connection')
      throw cause
    }

    try {
      const result = await callback(connection)
      await this.safeRelease(connection)
      return result
    } catch (cause: any) {
      await this.safeRelease(connection, cause)
      throw cause
    }
  }

  /** Runs a callback within a transaction.
   * If the data source does not support transactions, it will throw an error.
   *
   * @param callback Callback invoked with an active transaction.
   * @param connection Connection to reuse, to nest transactions within the same connection.
   * @return the value returned by the callback.
   */
  async runInTransaction<T>(
    callback: (connection: ConnectionType) => T | Promise<T>,
    connection?: ConnectionType
  ): Promise<T> {
    const handleTransaction = async (connection: ConnectionType) => {
      try {
        await this.beginTransaction(connection)
        const result = await callback(connection)
        await this.commit(connection)
        return result
      } catch (cause) {
        try {
          await this.rollback(connection)
        } catch (cause) {
          logger.error(cause, 'error rolling back transaction')
        }
        throw cause
      }
    }
    if (connection) {
      return await handleTransaction(connection as ConnectionType)
    } else {
      return await this.runWithConnection<T>(handleTransaction)
    }
  }

  /** Opens and returns a new connection to the data source.
   * @returns {Promise<ConnectionType>}the connection, never null.
   */
  protected abstract openConnection(): Promise<ConnectionType>

  /** Releases the connection previously acquired by openConnection().
   *
   * @param connection Connection to release.
   * @param error Error in case there were problems while using the connection.
   */
  protected abstract releaseConnection(connection: ConnectionType, error?: Error): Promise<any>

  /** Creates a new transaction, if supported.
   * If the data source does not support transactions, it throws an error.
   * @param connection Active connection.
   */
  protected beginTransaction(connection: ConnectionType): Promise<void> {
    throw new Error(`transactions not supported by this data source: ${connection}`)
  }

  /** Commits the current transaction.
   * If the data source does not support transactions, it throws an error.
   * @param connection Active connection.
   */
  protected commit(connection: ConnectionType): Promise<void> {
    throw new Error(`transactions not supported by this data source: ${connection}`)
  }

  /** Rollbacks the current transaction.
   * If the data source does not support transactions, it throws an error.
   * @param connection Active connection.
   */
  protected rollback(connection: ConnectionType): Promise<void> {
    throw new Error(`transactions not supported by this data source: ${connection}`)
  }

  /** Closes and clean this data source.
   * @returns {Promise<void>}
   */
  abstract shutdown(): Promise<void>

  private async safeRelease(connection?: ConnectionType, error?: Error): Promise<void> {
    try {
      if (connection) {
        await this.releaseConnection(connection, error)
      }
    } catch (cause: any) {
      logger.error(cause, 'error releasing connection')
    }
  }
}
