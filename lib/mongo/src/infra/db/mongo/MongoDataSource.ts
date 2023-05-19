import { createConnection, disconnect, Connection } from 'mongoose'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { DataSource } from '@quorum/lib/dataSource/src/infra/db/DataSource'
import { CollectionConfig } from '@quorum/lib/mongo/src/infra/db/mongo/CollectionConfig'
import { OpenCollection } from '@quorum/lib/mongo/src/infra/db/mongo/OpenCollection'

const logger = createLogger('MongoDataSource')

/** Data source to access the Mongo database.
 */
export class MongoDataSource extends DataSource<Connection> {
  private connection?: Connection

  constructor(
    /** Mongo connection string configured in the environment. */
    private readonly connectionString: string
  ) {
    super()
  }

  /** Executes a callback in the context of a collection and returns the result.
   * @param collection Collection to open.
   * @param callback Callback to perform actions using the collection.
   * @return returns the result from the callback.
   */
  async exec<ModelType, ResultType>(
    collection: CollectionConfig<ModelType>,
    callback: (collection: OpenCollection<ModelType>) => Promise<ResultType>
  ): Promise<ResultType> {
    return await this.runWithConnection(async (conn) => {
      return await callback(new OpenCollection(conn, collection))
    })
  }

  async shutdown(): Promise<void> {
    await disconnect()
  }

  protected async openConnection(): Promise<Connection> {
    if (!this.connection) {
      logger.info('connecting to Mongo')
      this.connection = await createConnection(this.connectionString)
    } else {
      logger.trace('using existing connection')
    }
    return this.connection
  }

  protected async releaseConnection(connection: Connection, error?: Error): Promise<void> {
    // Connection pool is handled internally by the connection.
    if (error) {
      logger.error(error)
    }
  }
}
