import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'elisma',
    })
  }

  async configureProject(project: Project<any>): Promise<void> {
    if (project.language === ProjectLanguage.TYPESCRIPT) {
      project.addDependencies(
        NpmDependency.runtime('tsconfig-paths', '^4.2.0'),
        NpmDependency.dev('@types/node', '^18.16.3'),
        NpmDependency.dev('@typescript-eslint/eslint-plugin', '^5.59.2'),
        NpmDependency.dev('@typescript-eslint/parser', '^5.59.2'),
        NpmDependency.dev('ts-node-dev', '^2.0.0'),
        NpmDependency.dev('typescript', '^5.0.4')
      )
    }
    project.addDependencies(
      NpmDependency.runtime('nodemon', '^2.0.22'),
      NpmDependency.runtime('awilix', '^8.0.1'),
      NpmDependency.dev('eslint', '^8.39.0'),
      NpmDependency.dev('eslint-config-prettier', '^8.8.0'),
      NpmDependency.dev('eslint-plugin-prettier', '^4.2.1'),
      NpmDependency.dev('lint-staged', '^13.2.2'),
      NpmDependency.dev('husky', '^8.0.3')
    )
    project.metadata['lint-staged'] = {
      '*.{js,cjs,ts}': 'eslint --cache --fix',
      '*.{css,md}': 'prettier --write',
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async files(bundle: Bundle<NonNullable<unknown>>): Promise<BundleFile[]> {
    const baseFiles = []

    if (bundle.project.language === ProjectLanguage.TYPESCRIPT) {
      baseFiles.push(BundleFile.include('./config/.eslintrc.typescript.cjs', './.eslintrc.cjs'))
    } else if (bundle.project.language === ProjectLanguage.JAVASCRIPT) {
      baseFiles.push(BundleFile.include('./config/.eslintrc.javascript.cjs', './.eslintrc.cjs'))
    }

    return [
      ...baseFiles,
      BundleFile.include('./config/tsconfig.json', './tsconfig.json', true),
      BundleFile.include('./src/infra/bootstrap.ts'),
      BundleFile.include('./src/index.ts'),
    ]
  }
}
