import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'
import { ReadmeFileHandler } from './ReadmeFileHandler'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'readme',
      description: 'generates the README file aggregating the documentation from all libraries',
      category: LibCategory.Documentation,
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    project.registerFileHandler(new ReadmeFileHandler())
    project.file('README.md')
  }
}
