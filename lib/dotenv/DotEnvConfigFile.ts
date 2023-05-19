import { ConfigFile } from '@quorum/elisma/src/domain/bundle/entities/ConfigFile'
import fs from 'fs/promises'
import path from 'path'

export const DOTENV_FILE_NAME = '.env'
export type DotEnvConfigEntry = { [key: string]: string }

export class DotEnvConfigFile extends ConfigFile<DotEnvConfigEntry> {
  constructor() {
    super(DOTENV_FILE_NAME)
  }

  private config: { [key: string]: string } = {}

  append(config: DotEnvConfigEntry): ConfigFile<DotEnvConfigEntry> {
    this.config = { ...this.config, ...config }
    return this
  }

  async writeTo(outputDir: string): Promise<void> {
    const resolvedConfig: string = Object.keys(this.config)
      .sort()
      .reduce((result, key) => {
        return `${result}${key}=${this.config[key]}\n`
      }, '')

    await fs.writeFile(path.join(outputDir, DOTENV_FILE_NAME), resolvedConfig)
  }
}
