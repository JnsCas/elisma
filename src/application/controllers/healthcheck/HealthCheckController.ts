import { FastifyReply, FastifyRequest } from 'fastify'

export class HealthCheckController {
  async status(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
    return res.send('OK')
  }
}
