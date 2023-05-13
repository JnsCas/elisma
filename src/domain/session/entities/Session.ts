import { IdManager } from '@quorum/elisma/src/infra/IdManager'

export class Session {
  private constructor(readonly id: string) {}

  static create(): Session {
    return new Session(IdManager.randomId())
  }
}
