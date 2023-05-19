import { Schema } from 'mongoose'
import { CollectionConfig } from '@quorum/lib/mongo/src/infra/db/mongo/CollectionConfig'
import { Ping } from '@quorum/lib/fastify/src/domain/pings/entities/Ping'
import { Optional } from '@quorum/lib/elisma/src/infra/Optional'
import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { MongoDataSource } from '@quorum/lib/mongo/src/infra/db/mongo/MongoDataSource'
import { PingRepository } from '@quorum/lib/fastify/src/domain/pings/PingRepository'

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
