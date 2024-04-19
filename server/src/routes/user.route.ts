import { FastifyRequest, FastifyInstance } from "fastify";

import { TodoController } from "../controllers/todo.controller";
import { UserController } from '../controllers/user.controller';
import { UserService } from "../services/user.service";
import { TodoService } from "../services/todo.service";
import { CreateTodoBody, UpdateTodoBody } from "../types";

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

    fastify.get('/user/:userId/todos', {
        schema: {
            description: 'Get todo',
            tags: ['todo'],
            summary: 'Get all todo for a specific user',
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            },
            response: {
                200: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        todo: { type: 'string' }
                    }
                },
                404: {
                    description: 'Not found',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            },
        }
    },
        (request: FastifyRequest<{ Params: { userId: string } }>, reply) => {
            const todoService = new TodoService(fastify);
            const todoController = new TodoController(todoService);
            todoController.getTodo(request, reply);
        });

    fastify.post('/user/:userId/todos', {
        schema: {
            description: 'Create todo',
            tags: ['todo'],
            summary: 'Create a new todo for a specific user',
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' }
                },
                required: ['name']
            },
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
    },
        (request: FastifyRequest<{ Params: { userId: string }; Body: CreateTodoBody }>, reply) => {
            const todoService = new TodoService(fastify);
            const todoController = new TodoController(todoService);
            todoController.createTodo(request, reply);
        });

    fastify.patch('/user/:userId/todos/:todoId', {
        schema: {
            description: 'Create todo',
            tags: ['todo'],
            summary: 'Create a new todo for a specific user',
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    isCompleted: { type: 'boolean' }
                }
            },
            response: {
                204: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        id: { type: 'string' }
                    }
                },
                404: {
                    description: 'Not found',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            },
        }
    },
        (request: FastifyRequest<{ Params: { userId: string; todoId: string; }; Body: UpdateTodoBody }>, reply) => {
            const todoService = new TodoService(fastify);
            const todoController = new TodoController(todoService);
            todoController.updateTodo(request, reply);
        });
}
