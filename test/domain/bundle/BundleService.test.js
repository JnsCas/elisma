import path from 'path'
import * as fs from 'fs/promises'
import { BundleService } from '@quorum/elisma/src/domain/bundle/BundleService'
import { SupportedLibraries } from '@quorum/elisma/src/SupportedLibraries'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { NpmProject } from '@quorum/elisma/src/domain/bundle/npm/NpmProject'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

const libraryPath = path.join(process.cwd(), 'lib')

describe('BundleManager', () => {
  test('builds a project', async () => {
    const manager = new BundleService(libraryPath)
    const outputDir = path.join(process.cwd(), 'out')
    const packageJson = JSON.parse((await fs.readFile(path.join(process.cwd(), 'src', 'package.base.json'))).toString())

    await manager.build(
      Bundle.create(
        NpmProject.create('@quorum/example', ProjectLanguage.TYPESCRIPT, packageJson),
        SupportedLibraries.filter((lib) => lib.packageName === 'fastify'),
        outputDir
      )
    )
  })
})
