import { CONTENT_TYPE_JSON } from '@quorum/elisma/src/application/controllers/schemas'

export const POST_OPENAI_OPTIONS = {
  schema: {
    description: 'Send prompt to Open AI',
    body: {
      type: 'object',
      required: ['prompt'],
      properties: {
        prompt: { type: 'string', minLength: 1 },
      },
    },
    ...CONTENT_TYPE_JSON,
  },
}
