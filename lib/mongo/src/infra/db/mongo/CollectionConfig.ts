import { Schema } from 'mongoose'
import { EntityModel } from '@quorum/lib/mongo/src/infra/db/mongo/OpenCollection'
import { DocumentExtensions } from '@quorum/lib/mongo/src/infra/db/mongo/DocumentExtensions'

/** Represents a Mongo collection.
 * @template EntityType Domain entity class that is mapped from this collection.
 */
export type CollectionConfig<EntityType> = {
  /** Collection name. */
  name: string
  /** Collection schema. */
  schema: Schema<EntityType, EntityModel<EntityType>, DocumentExtensions<EntityType>>
}
