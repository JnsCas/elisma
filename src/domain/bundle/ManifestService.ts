import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import Manifest from '@quorum/lib/fastify/manifest'
import fs from 'fs/promises'
import path from 'path'
import { createLogger } from '@quorum/elisma/src/infra/log'

const logger = createLogger('ManifestService')

export class ManifestService {
  constructor(
    /** Path where libraries are stored. */
    readonly libraryPath: string
  ) {}

  async findManifests(libs: string[]): Promise<Manifest[]> {
    const manifests = await this.loadManifests()
    let candidateManifests: Manifest[] = manifests

    if (libs.length > 0) {
      candidateManifests = libs.map((lib) => {
        const manifest = manifests.find((manifest) => manifest.name === lib)
        if (!manifest) {
          throw new Error(`manifest not found for library: ${lib}`)
        }
        return manifest
      })
    }

    const dependencies = this.resolveDependencies(manifests, candidateManifests)

    const resolvedManifests = [...new Set([...candidateManifests, ...dependencies])].sort(
      (manifest1, manifest2) => manifest2.order - manifest1.order
    )

    return this.validateExclusions(this.validateDependencies(resolvedManifests))
  }

  private async loadManifests(): Promise<LibManifest[]> {
    const libDirs = await fs.readdir(path.resolve(this.libraryPath))
    return await Promise.all(
      libDirs.map(async (libDir) => {
        const manifestFile = path.join(this.libraryPath, libDir, 'manifest.ts')
        logger.info(`loading manifest: ${manifestFile}`)
        const Manifest = (await require(manifestFile)).default
        return new Manifest()
      })
    )
  }

  private resolveDependencies(allManifests: LibManifest[], candidateManifests: LibManifest[]): LibManifest[] {
    const dependencyNames: string[] = [
      ...new Set(candidateManifests.flatMap((manifest) => manifest.requires.map((dependency) => dependency.name))),
    ].filter((dependency) => dependency !== undefined) as string[]

    return dependencyNames.map((dependency) => {
      const manifest = allManifests.find((manifest) => manifest.name === dependency)
      if (!manifest) {
        throw new Error(`manifest not found for library: ${dependency}`)
      }
      return manifest
    })
  }

  private validateDependencies(resolvedManifests: LibManifest[]): LibManifest[] {
    // Validates dependencies by category
    resolvedManifests.forEach((manifest) => {
      manifest.requires
        .filter((dependency) => dependency.category !== undefined)
        .map((dependency) => dependency.category)
        .forEach((requiredCategory) => {
          const valid = resolvedManifests.some((otherManifest) => otherManifest.category === requiredCategory)
          if (!valid) {
            throw new Error(
              `Library '${manifest.name}' requires category '${requiredCategory}' but there is no provider.`
            )
          }
        })
    })
    return resolvedManifests
  }

  private validateExclusions(resolvedManifests: LibManifest[]): LibManifest[] {
    resolvedManifests.forEach((manifest) => {
      manifest.excludes.forEach((exclusion) => {
        const invalidLib = resolvedManifests
          .filter((otherManifest) => otherManifest.name !== manifest.name)
          .find(
            (otherManifest) => otherManifest.name === exclusion.name || otherManifest.category === exclusion.category
          )
        if (invalidLib) {
          throw new Error(`Library '${manifest.name}' excludes '${invalidLib.name}' but it is present.`)
        }
      })
    })
    return resolvedManifests
  }
}
