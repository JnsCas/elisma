import path from 'path'
import * as fs from 'fs/promises'
import { BundleService } from '@quorum/elisma/src/domain/bundle/BundleService'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { NpmProject } from '@quorum/elisma/src/domain/bundle/npm/NpmProject'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

const libraryPath = path.join(process.cwd(), 'lib')

describe('BundleService', () => {
  test('builds a project', async () => {
    const manager = new BundleService(libraryPath)
    const outputDir = path.join(process.cwd(), 'out', 'bundler')
    const packageJson = JSON.parse((await fs.readFile(path.join(process.cwd(), 'src', 'package.base.json'))).toString())
    const candidateLibs = ['fastify', 'postgres', 'mongo', 'readme', 'docker-compose']
    const manifests = await manager.findManifests(candidateLibs)

    await manager.build(
      Bundle.create(NpmProject.create('@quorum/example', ProjectLanguage.TYPESCRIPT, manifests, packageJson), outputDir)
    )
  })
})
