import { createLogger } from '@quorum/elisma/src/infra/log'

const logger = createLogger('CompletionResponse')

export class CompletionResponse {
  private constructor(readonly answer: string) {}

  static restore(response: any): CompletionResponse {
    try {
      const jsonText = JSON.parse(response.choices[0].text)
      return new CompletionResponse(jsonText.answer)
    } catch (e) {
      logger.error(`response from AI ${response.choices[0].text}`)
      throw e
    }
  }
}
