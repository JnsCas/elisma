export const HEALTH_CHECK_OPTIONS = {
  schema: {
    description: 'Public endpoint for health check purposes',
    response: {
      200: {
        type: 'string',
        description: 'OK',
      },
    },
  },
}
