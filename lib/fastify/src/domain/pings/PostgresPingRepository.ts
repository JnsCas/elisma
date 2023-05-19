import { PostgresDataSource } from '@quorum/lib/postgres/src/infra/db/PostgresDataSource'
import { PingRepository } from '@quorum/lib/fastify/src/domain/pings/PingRepository'
import { Optional } from '@quorum/lib/elisma/src/infra/Optional'
import { Ping } from '@quorum/lib/fastify/src/domain/pings/entities/Ping'

const FIND_BY_ID = 'SELECT * FROM pings WHERE id=$1'
const SAVE_PING = 'INSERT INTO pings (id, message, created_at) VALUES ($1, $2, $3)'

export class PostgresPingRepository implements PingRepository {
  constructor(
    /** Data source to query the Postgres DB. */
    private readonly postgresDataSource: PostgresDataSource
  ) {}

  async findById(id: string): Promise<Optional<Ping>> {
    const result = await this.postgresDataSource.queryWithArgs(FIND_BY_ID, [id])
    return result.rows.length ? Ping.restore(result.rows[0]) : undefined
  }

  async save(ping: Ping): Promise<Ping> {
    const result = await this.postgresDataSource.queryWithArgs(SAVE_PING, [ping.id, ping.message, ping.createdAt])
    if (result.rowCount !== 1) {
      throw new Error('Error creating ping')
    }
    return ping
  }
}
