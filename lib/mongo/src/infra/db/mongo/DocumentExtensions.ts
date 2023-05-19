/** Adds a set of extension functions to Mongo documents using the Schema _methods_.
 * @template EntityType Domain entity class.
 */
export interface DocumentExtensions<EntityType> {
  toDomainEntity(): EntityType
}
