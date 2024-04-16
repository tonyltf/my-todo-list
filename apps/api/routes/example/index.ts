import { FastifyInstance } from "fastify/types/instance"

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (request, reply) {
    return 'this is an example'
  })
}
