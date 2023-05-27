export class ProjectFile {
  static create(name: string): ProjectFile {
    return new ProjectFile(name)
  }

  private constructor(
    /** Project file name. */
    readonly name: string
  ) {}

  private entries: { [key: string]: any }[] = []

  append(entry: { [key: string]: any }): ProjectFile {
    this.entries.push(entry)
    return this
  }

  getEntries(): any[] {
    return [...this.entries]
  }
}
