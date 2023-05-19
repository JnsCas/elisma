export const DOWNLOAD_ZIP_OPTIONS = {
  schema: {
    description: 'Download generated ZIP file',
    params: {
      type: 'object',
      required: ['sessionId'],
      properties: {
        sessionId: { type: 'string', minLength: 1 },
      },
    },
  },
}
