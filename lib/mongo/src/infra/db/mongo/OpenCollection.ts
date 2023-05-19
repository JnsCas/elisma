import { Model, Connection, Types } from 'mongoose'
import { DocumentExtensions } from '@quorum/lib/mongo/src/infra/db/mongo/DocumentExtensions'
import { CollectionConfig } from '@quorum/lib/mongo/src/infra/db/mongo/CollectionConfig'

export type EntityModel<ModelType> = Model<ModelType, object, DocumentExtensions<ModelType>>

/** Represents a collection in the context of an open connection.
 * The connection is provided by the data source.
 */
export class OpenCollection<ModelType> {
  constructor(
    /** Open connection to the DB. */
    private readonly connection: Connection,
    /** Configuration that describes this collection. */
    private readonly collection: CollectionConfig<ModelType>
  ) {}

  /** Returns the model for the collection.
   */
  get model(): EntityModel<ModelType> {
    return this.connection.model<ModelType, EntityModel<ModelType>>(this.collection.name, this.collection.schema)
  }

  /** Saves an entity in the underlying collection.
   * @param entity Entity to save.
   * @return returns the saved entity.
   */
  async saveOrUpdate(entity: ModelType & { id: string }): Promise<ModelType> {
    const exists = await this.model.exists({ _id: new Types.ObjectId(entity.id) }).exec()
    if (exists) {
      await this.model.updateOne({ _id: entity.id }, entity)
    } else {
      const raw: any = { ...entity, _id: entity.id }
      delete raw.id
      await this.model.create(raw)
    }
    return entity
  }
}
