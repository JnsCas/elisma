import { FastifyRequest } from 'fastify'

export type SelectedLibrary = {
  category: string
  packageName: string
}

export type ZipRequest = FastifyRequest<{
  Body: {
    selectedLibraries: SelectedLibrary[]
  }
}>
