import { AwilixContainer, createContainer, InjectionMode } from 'awilix'
import path from 'path'
import * as fs from 'fs/promises'

/** A module initializes some part of the application.
 *
 * It is possible to provide different modules in the [initApplication] function to
 * extend the base domain application.
 */
export type Module = (container: ApplicationContainer) => Promise<void>
export type StartCallback = () => Promise<void>

export type ApplicationContainer = AwilixContainer & {
  startCallbacks: StartCallback[]
  onStart(callback: StartCallback): void
}

function extendContainer(container: AwilixContainer): ApplicationContainer {
  const startCallbacks: StartCallback[] = []
  return Object.assign(container, {
    onStart(callback: StartCallback): void {
      startCallbacks.push(callback)
    },
    get startCallbacks(): StartCallback[] {
      return startCallbacks
    },
  })
}

export class ApplicationRegistry {
  private static modules: Module[] = []
  private static bootstrapDirs: string[] = []

  static addBootstrapDir(...paths: string[]) {
    ApplicationRegistry.bootstrapDirs.push(...paths)
  }

  static register(...modules: Module[]) {
    ApplicationRegistry.modules.push(...modules)
  }

  static async initialize(): Promise<ApplicationContainer> {
    // Loads all bootstrap modules
    await Promise.all(
      ApplicationRegistry.bootstrapDirs.map(async (bootstrapPath) => {
        const modulePath = path.join(process.cwd(), bootstrapPath)
        const files = (await fs.readdir(modulePath)).filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

        for (const file of files) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          await require(path.join(modulePath, file))
        }
      })
    )

    const container: ApplicationContainer = extendContainer(
      createContainer({
        injectionMode: InjectionMode.CLASSIC,
      })
    )

    await Promise.all(ApplicationRegistry.modules.map((init) => init(container)))
    await Promise.all(container.startCallbacks.map((startCallback: StartCallback) => startCallback()))

    return container
  }
}

/** Initializes the IoC container and calls the initialization modules.
 * @param bootstrapModules {Module[]} Modules to initialize as part of the application bootstrap.
 * @param postInitModules {Module[]} Modules processed after the container initialization.
 */
export async function initApplication(
  bootstrapModules: Module[] = [],
  postInitModules: Module[] = []
): Promise<ApplicationContainer> {
  const container: ApplicationContainer = extendContainer(
    createContainer({
      injectionMode: InjectionMode.CLASSIC,
    })
  )

  await Promise.all(bootstrapModules.map((init) => init(container)))
  await Promise.all(postInitModules.map((postInit) => postInit(container)))

  return container
}
