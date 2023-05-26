import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'

export const SupportedLibraries: LibraryDefinition[] = [
  LibraryDefinition.create('fastify', 'web framework', 'https://www.npmjs.com/package/fastify'),
  LibraryDefinition.create('pino', 'logger', 'https://www.npmjs.com/package/pino'),
  LibraryDefinition.create('postgres', 'database driver', 'https://www.npmjs.com/package/pg'),
  LibraryDefinition.create('mongo', 'database driver', 'https://www.npmjs.com/package/mongodb'),
]
