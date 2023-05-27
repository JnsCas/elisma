import { IdManager } from '@quorum/elisma/src/infra/IdManager'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { Optional } from '@quorum/elisma/src/infra/Optional'

export class Session {
  private resolvedBundle?: Bundle

  private constructor(readonly id: string) {}

  static create(): Session {
    return new Session(IdManager.randomId())
  }

  updateBundle(bundle: Bundle): Session {
    this.resolvedBundle = bundle
    return this
  }

  get bundle(): Optional<Bundle> {
    return this.resolvedBundle
  }
}
