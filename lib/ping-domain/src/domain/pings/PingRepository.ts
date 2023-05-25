import { Optional } from '@quorum/lib/elisma-loader/src/infra/Optional'
import { Ping } from '@quorum/lib/ping-domain/src/domain/pings/entities/Ping'

export interface PingRepository {
  findById(id: string): Promise<Optional<Ping>>
  save(user: Ping): Promise<Ping>
}
