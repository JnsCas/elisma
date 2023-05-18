import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'

export function createPrompt(libraries: LibraryDefinition[], projectRequirements: string): string {
  const libraryPrompt = libraries.map((library) => `* ${library.packageName} -> ${library.category}`).join('\n    ')

  return `
    I have the following list, where the text at the right of "->" is a library or framework name, and the text at
    the left is the type of library:
    
    ${libraryPrompt}
    
    I want to build a project in NodeJS with typescript. Based on my project requirements, suggest me only libraries
    and frameworks from the previous list (one of each type, only if it applies) that are best suited for the
    requirements, and write the links to the npm registry in the following format: type of library -> link to npm registry
    
    These are my project requirements: ${projectRequirements}.
  `
}
