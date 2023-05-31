import { FastifyRequest } from 'fastify'

export type SelectedLibrary = {
  category: string
  name: string
}

export type GenerateZipRequest = FastifyRequest<{
  Body: {
    projectName: string
    selectedLanguage: string
    selectedLibraries: SelectedLibrary[]
  }
}>
