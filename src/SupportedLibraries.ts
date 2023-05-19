import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'

export const SupportedLibraries: LibraryDefinition[] = [
  LibraryDefinition.create('express', 'web framework', 'https://www.npmjs.com/package/express'),
  LibraryDefinition.create('fastify', 'web framework', 'https://www.npmjs.com/package/fastify'),
  LibraryDefinition.create('jest', 'test framework', 'https://www.npmjs.com/package/jest'),
  LibraryDefinition.create('mocha', 'test framework', 'https://www.npmjs.com/package/mocha'),
  LibraryDefinition.create('pino', 'logger', 'https://www.npmjs.com/package/pino'),
  LibraryDefinition.create('winston', 'logger', 'https://www.npmjs.com/package/winston'),
  LibraryDefinition.create('postgres', 'database driver', 'https://www.npmjs.com/package/pg'),
  LibraryDefinition.create('mongo', 'database driver', 'https://www.npmjs.com/package/mongodb'),
  LibraryDefinition.create('commander', 'command line interface', 'https://www.npmjs.com/package/commander'),
]

export const SUPPORTED_LIBRARIES_JSON = SupportedLibraries.reduce(
  (result: { [key: string]: any }, library: LibraryDefinition) => {
    if (!result.hasOwnProperty(library.packageName)) {
      result[library.packageName] = { category: library.category }
    }
    return result
  },
  {}
)
