export class ChatResponse {
  private constructor(readonly answer?: string, readonly question?: string, readonly message?: string) {}

  static restore(response: any): ChatResponse {
    const content = response.choices[0].message.content
    try {
      const jsonContent = JSON.parse(content)
      return new ChatResponse(jsonContent.answer, jsonContent.question)
    } catch (e) {
      return new ChatResponse(undefined, undefined, content)
    }
  }
}
