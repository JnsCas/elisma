import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import * as fs from 'fs/promises'
import path from 'path'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import Manifest from '@quorum/lib/fastify/manifest'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { CandidateFile } from '@quorum/elisma/src/domain/bundle/entities/CandidateFile'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export class BundleManager {
  constructor(
    /** Path where libraries are stored. */
    readonly libraryPath: string
  ) {}

  async build<T>(bundle: Bundle<T>) {
    const manifests = await this.resolveManifests(bundle.libs)
    const files: CandidateFile[] = await this.validateAndResolveFiles(bundle, manifests)

    // cleans up output directory
    await fs.rm(bundle.outputDir, { recursive: true, force: true })
    await fs.mkdir(bundle.outputDir, { recursive: true })

    await this.configureProject(bundle, manifests)
    await this.copyFiles(bundle, files)
  }

  private async findManifests(): Promise<LibManifest[]> {
    const libDirs = await fs.readdir(path.resolve(this.libraryPath))
    return await Promise.all(
      libDirs.map(async (libDir) => {
        const manifestFile = path.join(this.libraryPath, libDir, 'manifest.ts')
        const Manifest = (await require(manifestFile)).default
        return new Manifest()
      })
    )
  }

  private async resolveManifests(libs: LibraryDefinition[]): Promise<Manifest[]> {
    const manifests = await this.findManifests()
    const candidateManifests: Manifest[] = libs.map((lib) => {
      const manifest = manifests.find((manifest) => manifest.config.name === lib.packageName)
      if (!manifest) {
        throw new Error(`manifest not found for library: ${lib.packageName}`)
      }
      return manifest
    })

    const dependencyNames: string[] = [
      ...new Set(
        candidateManifests.flatMap((manifest) => manifest.config.libDependencies?.map((dependency) => dependency.name))
      ),
    ].filter((dependency) => dependency !== undefined) as string[]

    const dependencies = dependencyNames.map((dependency) => {
      const manifest = manifests.find((manifest) => manifest.config.name === dependency)
      if (!manifest) {
        throw new Error(`manifest not found for library: ${dependency}`)
      }
      return manifest
    })

    return [...candidateManifests, ...dependencies]
  }

  private async validateAndResolveFiles<T>(bundle: Bundle<T>, manifests: Manifest[]): Promise<CandidateFile[]> {
    const files = await Promise.all(
      manifests.map(async (manifest: Manifest) => {
        const files = await manifest.files(bundle)

        return await Promise.all(
          files.map(async (file) => {
            const source = path.join(this.libraryPath, manifest.config.name, file.source)
            const target = path.join(bundle.outputDir, file.target)

            try {
              await fs.stat(source)
              return CandidateFile.create(manifest, BundleFile.include(source, target, file.filtered))
            } catch (err: any) {
              throw new Error(`file or directory not found: ${source}`)
            }
          })
        )
      })
    )

    return files.flat()
  }

  private async configureProject<T>(bundle: Bundle<T>, manifests: LibManifest[]) {
    await Promise.all(
      manifests.map(async (manifest) => await manifest.configureProject(bundle.project as Project<any>))
    )
    await bundle.project.writeTo(bundle.outputDir)
  }

  private async copyFiles<T>(bundle: Bundle<T>, files: CandidateFile[]) {
    for (const file of files) {
      await fs.mkdir(path.dirname(file.target), { recursive: true })

      if (file.filtered) {
        await fs.writeFile(file.target, await this.filterFile(bundle, file))
      } else {
        // TODO(nyx): filter files recursively
        await fs.cp(file.source, file.target, { recursive: true })
      }
    }
  }

  async filterFile<T>(bundle: Bundle<T>, file: CandidateFile): Promise<string> {
    const content = (await fs.readFile(file.source)).toString()
    let normalizedName: string = bundle.project.name

    if (!bundle.project.name.endsWith('/')) {
      normalizedName = `${bundle.project.name}/`
    }

    return content.replaceAll(/@quorum\/lib\/\w+\//gi, normalizedName)
  }
}
