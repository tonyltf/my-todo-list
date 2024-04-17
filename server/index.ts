import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import root from './routes/root'

const server = fastify()

server.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
  return 'pong\n'
})

server.register(root, { prefix: '/v1' })

server.listen({ port: 9080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})