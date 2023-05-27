import * as fs from 'fs/promises'
import path from 'path'
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

  async build(bundle: Bundle): Promise<Bundle> {
    // cleans up output directory
    await fs.rm(bundle.outputDir, { recursive: true, force: true })
    await fs.mkdir(bundle.outputDir, { recursive: true })

    await this.validateProject(bundle)
    await this.configureProject(bundle)
    await this.prepare(bundle)
    await this.validateFiles(bundle)
    await this.copyFiles(bundle)

    return bundle
  }

  private async validateProject(bundle: Bundle) {
    const invalidByLanguage = bundle.project.manifests
      .filter((manifest) => manifest.languages.length && !manifest.languages.includes(bundle.project.language))
      .map((manifest) => manifest.name)

    if (invalidByLanguage.length) {
      throw new Error(`
        the following libraries do not support the project programming language:
        language=${bundle.project.language}, libraries=${invalidByLanguage.join(',')}
      `)
    }
  }

  private async prepare(bundle: Bundle): Promise<void> {
    await Promise.all(
      bundle.project.manifests.map(async (manifest: Manifest) => {
        await manifest.prepareBundle(bundle)
      })
    )
  }

  private async validateFiles(bundle: Bundle): Promise<void> {
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

  private async configureProject(bundle: Bundle) {
    await Promise.all(
      bundle.project.manifests.map(async (manifest) => await manifest.configureProject(bundle.project as Project))
    )
    await bundle.project.writeConfig(bundle.outputDir)
  }

  private async copyFiles(bundle: Bundle) {
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

  private async filterFile(bundle: Bundle, file: string): Promise<string> {
    const content = (await fs.readFile(file)).toString()
    let normalizedName: string = bundle.project.name

    if (!bundle.project.name.endsWith('/')) {
      normalizedName = `${bundle.project.name}/`
    }

    return content.replaceAll(/@quorum\/lib\/[\w-]+\//gi, normalizedName)
  }

  private async filterDirectory(bundle: Bundle, dataDir: BundleFile) {
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
