export const PING_OPTIONS = {
  schema: {
    description: 'Process run results',
    querystring: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
}
