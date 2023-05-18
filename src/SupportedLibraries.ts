import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'

export const SupportedLibraries: LibraryDefinition[] = [
  LibraryDefinition.create('fastify', 'web framework', 'https://www.npmjs.com/package/fastify'),
  LibraryDefinition.create('jest', 'test framework', 'https://www.npmjs.com/package/jest'),
  LibraryDefinition.create('pino', 'logger', 'https://www.npmjs.com/package/pino'),
  LibraryDefinition.create('postgres', 'database driver', 'https://www.npmjs.com/package/pg'),
  LibraryDefinition.create('sqlite', 'database driver', 'https://www.npmjs.com/package/sqlite3'),
  LibraryDefinition.create('mysql', 'database driver', 'https://www.npmjs.com/package/mysql'),
  LibraryDefinition.create('mongo', 'database driver', 'https://www.npmjs.com/package/mongodb'),
  LibraryDefinition.create('commander', 'command line interface', 'https://www.npmjs.com/package/commander'),
]
