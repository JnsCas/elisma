import path from 'path'
import { BundleService } from '@quorum/elisma/src/domain/bundle/BundleService'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { NpmProject } from '@quorum/elisma/src/domain/bundle/npm/NpmProject'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { ManifestService } from '@quorum/elisma/src/domain/bundle/ManifestService'
import { default as ReadmeManifest } from '@quorum/lib/readme/manifest'
import { default as DockerComposeManifest } from '@quorum/lib/docker-compose/manifest'
import { default as FastifyManifest } from '@quorum/lib/fastify/manifest'
import { default as ExpressManifest } from '@quorum/lib/express/manifest'

const libraryPath = path.join(process.cwd(), 'lib')

describe('BundleService', () => {
  test('builds a project', async () => {
    const manifestService = new ManifestService(libraryPath)
    const manager = new BundleService(libraryPath)
    const outputDirFastify = path.join(process.cwd(), 'out', 'bundler-fastify')
    const outputDirExpress = path.join(process.cwd(), 'out', 'bundler-express')
    const candidateLibs = [new ReadmeManifest(), new DockerComposeManifest()]
    const manifestsFastify = await manifestService.findManifests([...candidateLibs, new FastifyManifest()])
    const manifestsExpress = await manifestService.findManifests([...candidateLibs, new ExpressManifest()])

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
