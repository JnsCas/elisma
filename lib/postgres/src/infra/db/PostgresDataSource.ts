import { Pool, PoolClient, QueryResult } from 'pg'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { DataSource } from '@quorum/lib/dataSource/src/infra/db/DataSource'

const logger = createLogger('PostgresDataSource')

export class PostgresDataSource extends DataSource<PoolClient> {
  constructor(
    /** Postgres connection pool. */
    private readonly pool: Pool
  ) {
    super()
  }

  async query(preparedStatement: any): Promise<QueryResult> {
    return await this.runWithConnection((client) => client.query(preparedStatement))
  }

  async queryWithArgs(query: any, args: any[]): Promise<QueryResult> {
    return await this.runWithConnection((client) => client.query(query, args))
  }

  async shutdown(): Promise<void> {
    await this.pool.end()
  }

  protected async openConnection(): Promise<PoolClient> {
    let valid = false
    let client

    do {
      // The connection pool does not handle unrejected promises, if there is an error ejecuting
      // a query, the connection will be closed but the pool will not evict the dead connection.
      // We need to implement a heartbeat to workaround this issue.
      client = await this.pool.connect()

      if (!client.listenerCount('error')) {
        // Prevents the process to exit due to a weird, unjustifiable Node design.
        client.on('error', (error) => {
          logger.error(error, 'Postgres connection error')
        })
      }
      valid = await this.heartbeat(client)
    } while (!valid)

    return client
  }

  protected async releaseConnection(connection: PoolClient, error?: Error): Promise<void> {
    await connection.release(error)
  }

  protected async beginTransaction(connection: PoolClient): Promise<void> {
    await connection.query('BEGIN')
  }

  protected async commit(connection: PoolClient): Promise<void> {
    await connection.query('COMMIT')
  }

  protected async rollback(connection: PoolClient): Promise<void> {
    await connection.query('ROLLBACK')
  }

  private async heartbeat(connection: PoolClient): Promise<boolean> {
    try {
      const { rows } = await connection.query('SELECT 1')
      return rows.length > 0
    } catch (cause: any) {
      logger.debug(cause, 'heartbeat query failed')
      await this.releaseConnection(connection, cause)
    }

    return false
  }
}
