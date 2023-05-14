import { FastifyInstance } from 'fastify'
import fastifyStatic from '@fastify/static'
import * as path from 'path'
import { server } from '@quorum/elisma/src/config'

export default function (app: FastifyInstance) {
  const publicDir: string = path.join(__dirname, '../../../', server.publicDir)

  app.register(fastifyStatic, {
    root: publicDir,
    prefix: '/',
  })
  app.setNotFoundHandler((req, res) => {
    res.sendFile('index.html')
  })
}
