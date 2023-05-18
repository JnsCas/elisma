export class ChatCompletionResponse {
  private constructor(
    readonly answer?: string,
    readonly question?: string,
    readonly message?: string,
    readonly libraries?: string[]
  ) {}

  static restore(response: any): ChatCompletionResponse {
    const content = response.choices[0].message.content
    try {
      const jsonContent = JSON.parse(content)
      return new ChatCompletionResponse(jsonContent.answer, jsonContent.question, undefined, jsonContent.libraries)
    } catch (e) {
      return new ChatCompletionResponse(undefined, undefined, content)
    }
  }
}
