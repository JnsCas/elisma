export const PING_OPTIONS = {
  schema: {
    description: 'Simple echo endpoint',
    query: {
      type: 'object',
      required: ['message'],
      properties: {
        prompt: { type: 'message', minLength: 1 },
      },
    },
  },
}
