export class Ping {
  static create(id: string, message: string): Ping {
    return new Ping(id, message, new Date())
  }

  static restore(user: any): Ping {
    return new Ping(user.id || user._id.toString(), user.message, new Date(user.lastName || user.last_name))
  }

  private constructor(
    /** Unique identifier. */
    readonly id: string,
    readonly message: string,
    readonly createdAt: Date
  ) {}
}
