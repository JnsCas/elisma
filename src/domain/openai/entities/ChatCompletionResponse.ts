export class ChatCompletionResponse {
  private constructor(readonly answer?: string, readonly question?: string, readonly libraries?: string[]) {}

  static restore(response: any): ChatCompletionResponse {
    const content = response.choices[0].message.content
    const jsonContent = JSON.parse(content)
    return new ChatCompletionResponse(jsonContent.answer, jsonContent.question, jsonContent.libraries)
  }
}
