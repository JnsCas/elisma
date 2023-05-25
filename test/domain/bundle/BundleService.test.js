import path from 'path'
import { BundleService } from '@quorum/elisma/src/domain/bundle/BundleService'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { NpmProject } from '@quorum/elisma/src/domain/bundle/npm/NpmProject'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

const libraryPath = path.join(process.cwd(), 'lib')

describe('BundleService', () => {
  test('builds a project', async () => {
    const manager = new BundleService(libraryPath)
    const outputDirFastify = path.join(process.cwd(), 'out', 'bundler-fastify')
    const outputDirExpress = path.join(process.cwd(), 'out', 'bundler-express')
    const candidateLibs = ['postgres', 'mongo', 'readme', 'docker-compose']
    const manifestsFastify = await manager.findManifests([...candidateLibs, 'fastify'])
    const manifestsExpress = await manager.findManifests([...candidateLibs, 'express'])

    await manager.build(
      Bundle.create(
        NpmProject.create('@quorum/example', ProjectLanguage.TYPESCRIPT, manifestsFastify),
        outputDirFastify
      )
    )
    await manager.build(
      Bundle.create(
        NpmProject.create('@quorum/example', ProjectLanguage.TYPESCRIPT, manifestsExpress),
        outputDirExpress
      )
    )
  })
})
