import * as fs from 'fs/promises'
import path from 'path'
import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import Manifest from '@quorum/lib/fastify/manifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { createLogger } from '@quorum/elisma/src/infra/log'

const logger = createLogger('BundleService')

export class BundleService {
  constructor(
    /** Path where libraries are stored. */
    readonly libraryPath: string
  ) {}

  async findManifests(libs: string[] = []): Promise<LibManifest[]> {
    return await this.resolveManifests(libs)
  }

  async build<T>(bundle: Bundle<T>): Promise<Bundle<T>> {
    // cleans up output directory
    await fs.rm(bundle.outputDir, { recursive: true, force: true })
    await fs.mkdir(bundle.outputDir, { recursive: true })

    await this.configureProject(bundle)
    await this.prepare(bundle)
    await this.validateFiles(bundle)
    await this.copyFiles(bundle)

    return bundle
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

  private async resolveManifests(libs: string[]): Promise<Manifest[]> {
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

    const dependencyNames: string[] = [
      ...new Set(candidateManifests.flatMap((manifest) => manifest.requires.map((dependency) => dependency.name))),
    ].filter((dependency) => dependency !== undefined) as string[]

    const dependencies = dependencyNames.map((dependency) => {
      const manifest = manifests.find((manifest) => manifest.name === dependency)
      if (!manifest) {
        throw new Error(`manifest not found for library: ${dependency}`)
      }
      return manifest
    })

    return [...new Set([...candidateManifests, ...dependencies])].sort(
      (manifest1, manifest2) => manifest2.order - manifest1.order
    )
  }

  private async prepare<T>(bundle: Bundle<T>): Promise<void> {
    await Promise.all(
      bundle.project.manifests.map(async (manifest: Manifest) => {
        await manifest.prepareBundle(bundle)
      })
    )
  }

  private async validateFiles<T>(bundle: Bundle<T>): Promise<void> {
    await Promise.all(
      bundle.files.map(async (file) => {
        const source = path.resolve(this.libraryPath, file.source)

        try {
          await fs.stat(source)
        } catch (err: any) {
          throw new Error(`file or directory not found: ${source}`)
        }
      })
    )
  }

  private async configureProject<T>(bundle: Bundle<T>) {
    await Promise.all(
      bundle.project.manifests.map(async (manifest) => await manifest.configureProject(bundle.project as Project<any>))
    )
    await bundle.project.writeTo(bundle.outputDir)
    await bundle.project.writeConfig(bundle.outputDir)
  }

  private async copyFiles<T>(bundle: Bundle<T>) {
    // prevents concurrent modification
    const files = [...bundle.files]

    for (const file of files) {
      const source = path.join(this.libraryPath, file.source)
      const target = path.join(bundle.outputDir, file.target)
      logger.info(`processing file: source=${source}, target=${target}`)
      const stats = await fs.stat(source)

      // Creates the target directory if it does not exist.
      logger.info('ensuring path exists')
      if (stats.isFile()) {
        await fs.mkdir(path.dirname(target), { recursive: true })
      } else if (stats.isDirectory()) {
        await fs.mkdir(target, { recursive: true })
      }

      if (stats.isFile()) {
        if (file.mustFilter) {
          logger.info('filtering and writing file')
          await fs.writeFile(target, await this.filterFile(bundle, source))
        } else {
          logger.info('copying file without filtering')
          await fs.cp(source, target, { recursive: true })
        }
      } else {
        logger.info('source file is a directory, adding files recursively')
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
        logger.info(`adding file: source=${sourceFile}, target=${targetFile}`)
        const content = await this.filterFile(bundle, sourceFile)

        await fs.mkdir(path.dirname(targetFile), { recursive: true })
        await fs.writeFile(targetFile, content)

        bundle.addFiles(BundleFile.include(dataDir.manifest, sourceFile, targetFile))
      }
    }
  }
}
