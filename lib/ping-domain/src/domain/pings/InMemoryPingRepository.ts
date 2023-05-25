import { PingRepository } from '@quorum/lib/ping-domain/src/domain/pings/PingRepository'
import { Ping } from '@quorum/lib/ping-domain/src/domain/pings/entities/Ping'
import { Optional } from '@quorum/lib/elisma-loader/src/infra/Optional'

export class InMemoryPingRepository implements PingRepository {
  private storage: { [key: string]: Ping } = {}

  async findById(id: string): Promise<Optional<Ping>> {
    return this.storage[id]
  }

  async save(ping: Ping): Promise<Ping> {
    this.storage[ping.id] = ping
    return ping
  }
}
