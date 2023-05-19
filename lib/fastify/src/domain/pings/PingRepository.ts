import { Optional } from '@quorum/lib/elisma/src/infra/Optional'
import { Ping } from '@quorum/lib/fastify/src/domain/pings/entities/Ping'

export interface PingRepository {
  findById(id: string): Promise<Optional<Ping>>
  save(user: Ping): Promise<Ping>
}
