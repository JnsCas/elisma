import { Schema } from 'mongoose'
import { CollectionConfig } from '@quorum/lib/mongo/src/infra/db/mongo/CollectionConfig'
import { MongoDataSource } from '@quorum/lib/mongo/src/infra/db/mongo/MongoDataSource'
import { Optional } from '@quorum/lib/elisma-loader/src/infra/Optional'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { PingRepository } from '@quorum/lib/ping-domain/src/domain/pings/PingRepository'
import { Ping } from '@quorum/lib/ping-domain/src/domain/pings/entities/Ping'

export const PingCollection: CollectionConfig<Ping> = {
  name: 'pings',
  schema: new Schema(
    {
      message: String,
      createdAt: Date,
    },
    {
      methods: {
        toDomainEntity() {
          return Ping.restore(this)
        },
      },
    }
  ),
}

const logger = createLogger('MongoPingRepository')

export class MongoPingRepository implements PingRepository {
  constructor(private readonly mongoDataSource: MongoDataSource) {}

  async findById(id: string): Promise<Optional<Ping>> {
    logger.debug(`finding ping by id: ${id}`)
    return await this.mongoDataSource.exec(PingCollection, async (collection) => {
      const document = await collection.model.findOne({ _id: id }).exec()
      return document?.toDomainEntity()
    })
  }

  async save(ping: Ping): Promise<Ping> {
    logger.debug(`saving ping: ${JSON.stringify(ping)}`)

    return await this.mongoDataSource.exec(PingCollection, async (collection) => {
      return collection.saveOrUpdate(ping)
    })
  }
}
