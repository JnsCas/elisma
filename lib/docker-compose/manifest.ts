import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { DockerComposeFileHandler } from './DockerComposeFileHandler'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'docker-compose',
      languages: [ProjectLanguage.TYPESCRIPT, ProjectLanguage.JAVASCRIPT],
      description: 'Builds the docker-compose.yml file aggregating the services from all libraries.',
      category: LibCategory.Infra,
      order: 99999,
    })
  }

  async configureProject(project: Project): Promise<void> {
    project.registerFileHandler(new DockerComposeFileHandler())
    project.file('docker-compose.yml').append({
      version: '3.2',
    })
  }
}
