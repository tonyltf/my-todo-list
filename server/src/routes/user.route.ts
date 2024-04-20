import { FastifyInstance } from "fastify";

import { UserController } from '../controllers/user.controller';
import { UserService } from "../services/user.service";

export default async function (fastify: FastifyInstance) {

    fastify.post('/user', {
        schema: {
            description: 'Create user',
            tags: ['user'],
            summary: 'Create a new user if it does not exist',
            response: {
                201: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        id: { type: 'string' }
                    }
                }
            },
        }
    }, (request, reply) => {
        const userService = new UserService(fastify);
        const userController = new UserController(userService);
        userController.createUser(request, reply);
    });
}
