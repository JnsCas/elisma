import { LibManifest } from '@quorum/elisma/src/domain/bundle/LibManifest'
import { Bundle } from '@quorum/elisma/src/domain/bundle/entities/Bundle'
import { BundleFile } from '@quorum/elisma/src/domain/bundle/entities/BundleFile'
import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { NpmDependency } from '@quorum/elisma/src/domain/bundle/npm/NpmDependency'
import { LibDependency } from '@quorum/elisma/src/domain/bundle/entities/LibDependency'
import { LibCategory } from '@quorum/elisma/src/domain/bundle/entities/LibCategory'
import { Project } from '@quorum/elisma/src/domain/bundle/Project'

export default class Manifest extends LibManifest {
  constructor() {
    super({
      name: 'elisma-loader',
      languages: [ProjectLanguage.TYPESCRIPT, ProjectLanguage.JAVASCRIPT],
      description: 'Opinionated application loader',
      category: LibCategory.Loader,
      requires: [LibDependency.byName('pino'), LibDependency.byName('dotenv')],
      docs: `
        This loader provides an IoC container using Awilix, a dependency injection library. It allows libraries to
        register their own context in the application using a bootstrap directory. All files in the bootstrap
        directory will be dynamically loaded at the application startup. The default bootstrap directory where
        all libraries must put their initialization code is __src/bootstrap/__.
        
        Libraries must use the ApplicationRegistry global component to register themselves into the application
        context. The following example shows a bootstrap file:
        
          ApplicationRegistry.register(async function (container: ApplicationContainer) {
            container.register({
              libComponent1: asClass(LibComponent1).singleton(),
              libComponent2: asFunction(newLibComponent2).singleton(),
            })
          
            container.onStart(async () => {
              const component1 = container.cradle.libComponent1
              const component2 = container.cradle.libComponent2
              component1.start()
              component2.start()
            })
          })
      `,
    })
  }

  async configureProject(project: Project): Promise<void> {
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
    project.configFile.append({
      'lint-staged': {
        '*.{js,cjs,ts}': 'eslint --cache --fix',
        '*.{css,md}': 'prettier --write',
      },
    })
    project.configFile.append({
      scripts: {
        start: 'ts-node-dev -r tsconfig-paths/register src/index.ts',
      },
    })
  }

  async prepareBundle(bundle: Bundle): Promise<void> {
    if (bundle.project.language === ProjectLanguage.TYPESCRIPT) {
      bundle.addFiles(BundleFile.include(this, './config/.eslintrc.typescript.cjs', './.eslintrc.cjs'))
    } else if (bundle.project.language === ProjectLanguage.JAVASCRIPT) {
      bundle.addFiles(BundleFile.include(this, './config/.eslintrc.javascript.cjs', './.eslintrc.cjs'))
    }

    bundle.addFiles(
      BundleFile.include(this, './config/tsconfig.json', './tsconfig.json').filtered(),
      BundleFile.include(this, './src/infra/bootstrap.ts'),
      BundleFile.include(this, './src/infra/configUtils.ts'),
      BundleFile.include(this, './src/infra/Optional.ts'),
      BundleFile.include(this, './src/index.ts')
    )
  }
}
