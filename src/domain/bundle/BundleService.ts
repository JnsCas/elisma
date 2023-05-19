import { LibraryDefinition } from '@quorum/elisma/src/domain/bundle/entities/LibraryDefinition'
import * as fs from 'fs/promises'
import path from 'path'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import Manifest from '@quorum/lib/fastify/manifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'

export class BundleService {
  constructor(
    /** Path where libraries are stored. */
    readonly libraryPath: string
  ) {}

  async build<T>(bundle: Bundle<T>): Promise<Bundle<T>> {
    const manifests = await this.resolveManifests(bundle.libs)

    // cleans up output directory
    await fs.rm(bundle.outputDir, { recursive: true, force: true })
    await fs.mkdir(bundle.outputDir, { recursive: true })

    await this.configureProject(bundle, manifests)
    await this.prepare(bundle, manifests)
    await this.validateFiles(bundle)
    await this.copyFiles(bundle)

    return bundle
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

  private async prepare<T>(bundle: Bundle<T>, manifests: Manifest[]): Promise<void> {
    await Promise.all(
      manifests.map(async (manifest: Manifest) => {
        await manifest.prepare(bundle)
      })
    )
  }

  private async validateFiles<T>(bundle: Bundle<T>): Promise<void> {
    await Promise.all(
      bundle.files.map(async (file) => {
        const source = path.join(this.libraryPath, file.source)

        try {
          await fs.stat(source)
        } catch (err: any) {
          throw new Error(`file or directory not found: ${source}`)
        }
      })
    )
  }

  private async configureProject<T>(bundle: Bundle<T>, manifests: LibManifest[]) {
    await Promise.all(
      manifests.map(async (manifest) => await manifest.configureProject(bundle.project as Project<any>))
    )
    await bundle.project.writeTo(bundle.outputDir)
  }

  private async copyFiles<T>(bundle: Bundle<T>) {
    // prevents concurrent modification
    const files = [...bundle.files]

    for (const file of files) {
      const source = path.join(this.libraryPath, file.source)
      const target = path.join(bundle.outputDir, file.target)
      const stats = await fs.stat(source)

      // Creates the target directory if it does not exist.
      if (stats.isFile()) {
        await fs.mkdir(path.dirname(target), { recursive: true })
      } else if (stats.isDirectory()) {
        await fs.mkdir(target, { recursive: true })
      }

      if (stats.isFile()) {
        if (file.mustFilter) {
          await fs.writeFile(target, await this.filterFile(bundle, source))
        } else {
          await fs.cp(source, target, { recursive: true })
        }
      } else {
        await this.filterDirectory(bundle, file)
      }
    }
  }

  private async filterFile<T>(bundle: Bundle<T>, file: string): Promise<string> {
    const content = (await fs.readFile(file)).toString()
    let normalizedName: string = bundle.project.name

    if (!bundle.project.name.endsWith('/')) {
      normalizedName = `${bundle.project.name}/`
    }

    return content.replaceAll(/@quorum\/lib\/\w+\//gi, normalizedName)
  }

  private async filterDirectory(bundle: Bundle<any>, dataDir: BundleFile) {
    // traverse the directory tree using a queue to avoid recursion.
    const queue: string[] = await fs.readdir(path.join(this.libraryPath, dataDir.source))

    while (queue.length) {
      const current = queue.shift() as string
      const absolutePath = path.join(this.libraryPath, dataDir.source, current)
      const stats = await fs.stat(absolutePath)

      if (stats.isDirectory()) {
        const nextFiles = (await fs.readdir(absolutePath)).map((file) => `${current}/${file}`)
        queue.push(...nextFiles)
      } else {
        const sourceFile = path.join(this.libraryPath, dataDir.source, current)
        const targetFile = path.join(bundle.outputDir, dataDir.target, current)
        const content = await this.filterFile(bundle, sourceFile)

        await fs.mkdir(path.dirname(targetFile), { recursive: true })
        await fs.writeFile(targetFile, content)

        bundle.addFiles(BundleFile.include(dataDir.manifest, sourceFile, targetFile))
      }
    }
  }
}
