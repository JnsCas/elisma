import { AwilixContainer, createContainer, InjectionMode } from 'awilix'

/** A module initializes some part of the application.
 *
 * It is possible to provide different modules in the [initApplication] function to
 * extend the base domain application.
 */
export type Module = (container: ApplicationContainer) => Promise<void>

export type ApplicationContainer = AwilixContainer & {
  beansOfType<T>(type: any): T[]
}

function extendContainer(container: AwilixContainer): ApplicationContainer {
  return Object.assign(container, {
    beansOfType<T>(type: any): T[] {
      return Object.keys(container.registrations)
        .map((beanName) => container.cradle[beanName])
        .filter((instance) => instance instanceof type)
    },
  })
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
