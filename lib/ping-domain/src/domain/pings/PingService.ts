import { createLogger } from '@quorum/lib/pino/src/infra/log'
import { PingRepository } from '@quorum/lib/ping-domain/src/domain/pings/PingRepository'
import { Ping } from '@quorum/lib/ping-domain/src/domain/pings/entities/Ping'
import { Optional } from '@quorum/lib/elisma-loader/src/infra/Optional'

const logger = createLogger('UserService')

export class PingService {
  constructor(
    /** Repository to handle users. */
    private readonly pingRepository: PingRepository
  ) {}

  async save(ping: Ping): Promise<Ping> {
    logger.info('creating new ping')
    return await this.pingRepository.save(ping)
  }

  async findById(id: string): Promise<Optional<Ping>> {
    logger.info('finding ping by id')
    return await this.pingRepository.findById(id)
  }
}
