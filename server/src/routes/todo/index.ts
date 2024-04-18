import { FastifyReply, FastifyRequest } from "fastify"
import { FastifyInstance } from "fastify/types/instance"

export default async function (fastify: FastifyInstance) {
    fastify.get('/todo', {
        schema: {
            description: 'Get todo',
            tags: ['todo'],
            summary: 'Example endpoint',
            response: {
                200: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        todo: { type: 'string' }
                    }
                }
            }
        }
    }, async function (request: FastifyRequest, reply: FastifyReply) {
        return 'TODO';
    });
}
