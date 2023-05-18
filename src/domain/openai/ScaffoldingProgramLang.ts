import { ProjectLanguage } from '@quorum/elisma/src/domain/scaffolding/entities/ProjectLanguage'

export function createProgramLangPrompt(): string {
  return `
    I have the following list which includes programming languages.
    
    ${Object.values(ProjectLanguage).join(' or ')}
    
    Ask me which programming languages I want to use from the previous list.
  `
}