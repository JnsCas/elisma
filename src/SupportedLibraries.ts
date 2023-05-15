import { Library } from '@quorum/elisma/src/domain/scaffolding/entities/Library'

export const SupportedLibraries: Library[] = [
  Library.create('express', 'web framework', 'https://www.npmjs.com/package/express'),
  Library.create('fastify', 'web framework', 'https://www.npmjs.com/package/fastify'),
  Library.create('jest', 'test framework', 'https://www.npmjs.com/package/jest'),
  Library.create('mocha', 'test framework', 'https://www.npmjs.com/package/mocha'),
  Library.create('pino', 'logger', 'https://www.npmjs.com/package/pino'),
  Library.create('winston', 'logger', 'https://www.npmjs.com/package/winston'),
  Library.create('postgres', 'database driver', 'https://www.npmjs.com/package/pg'),
  Library.create('mongo', 'database driver', 'https://www.npmjs.com/package/mongodb'),
  Library.create('sqlite', 'database driver', 'https://www.npmjs.com/package/sqlite3'),
  Library.create('mysql', 'database driver', 'https://www.npmjs.com/package/mysql'),
  Library.create('commander', 'command line interface', 'https://www.npmjs.com/package/commander'),
]
