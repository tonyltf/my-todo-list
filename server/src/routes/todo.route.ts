import { FastifyInstance, FastifyRequest } from 'fastify';

import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo.service';
import { CreateTodoBody, UpdateTodoBody } from '../types';
import { StatusCodes } from '../types/status-code';

export default async function (fastify: FastifyInstance) {
    fastify.get(
        '/user/:userId/todos',
        {
            schema: {
                description: 'Get todo',
                tags: ['todo'],
                summary: 'Get all todo for a specific user',
                params: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            pattern:
                                '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
                        },
                    },
                    required: ['userId'],
                },
                response: {
                    [StatusCodes.OK]: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                name: { type: 'string' },
                                userId: { type: 'string', format: 'uuid' },
                                isEnabled: { type: 'boolean' },
                                isCompleted: { type: 'boolean' },
                                completedAt: {
                                    type: 'string',
                                    format: 'date-time',
                                    nullable: true,
                                },
                                createdAt: {
                                    type: 'string',
                                    format: 'date-time',
                                },
                                updatedAt: {
                                    type: 'string',
                                    format: 'date-time',
                                },
                            },
                            required: [
                                'id',
                                'name',
                                'userId',
                                'isEnabled',
                                'isCompleted',
                                'completedAt',
                                'createdAt',
                                'updatedAt',
                            ],
                        },
                    },
                    [StatusCodes.BAD_REQUEST]: {
                        description: 'Bad request',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            details: {
                                type: 'array',
                            },
                        },
                    },
                    [StatusCodes.NOT_FOUND]: {
                        description: 'Not found',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            },
        },
        (request: FastifyRequest<{ Params: { userId: string } }>, reply) => {
            const todoService = new TodoService(fastify);
            const todoController = new TodoController(todoService);
            todoController.getTodo(request, reply);
        },
    );

    fastify.post(
        '/user/:userId/todos',
        {
            schema: {
                description: 'Create todo',
                tags: ['todo'],
                summary: 'Create a new todo for a specific user',
                params: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                    },
                    required: ['userId'],
                },
                body: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                    },
                    required: ['name'],
                },
                response: {
                    [StatusCodes.CREATED]: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            userId: { type: 'string' },
                            isEnabled: { type: 'boolean' },
                            isCompleted: { type: 'boolean' },
                            completedAt: {
                                type: 'string',
                                format: 'date-time',
                                nullable: true,
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                        required: [
                            'id',
                            'name',
                            'userId',
                            'isEnabled',
                            'isCompleted',
                            'completedAt',
                            'createdAt',
                            'updatedAt',
                        ],
                    },
                    [StatusCodes.BAD_REQUEST]: {
                        description: 'Bad request',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            details: {
                                type: 'array',
                            },
                        },
                    },
                    [StatusCodes.INTERNAL_SERVER_ERROR]: {
                        description: 'Failed to create todo',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            },
        },
        (
            request: FastifyRequest<{
                Params: { userId: string };
                Body: CreateTodoBody;
            }>,
            reply,
        ) => {
            const todoService = new TodoService(fastify);
            const todoController = new TodoController(todoService);
            todoController.createTodo(request, reply);
        },
    );

    fastify.patch(
        '/user/:userId/todos/:todoId',
        {
            schema: {
                description: 'Update todo',
                tags: ['todo'],
                summary: 'Update a specific todo',
                params: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                        todoId: { type: 'string' },
                    },
                    required: ['userId', 'todoId'],
                },
                body: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        isCompleted: { type: 'boolean' },
                    },
                },
                response: {
                    [StatusCodes.NO_CONTENT]: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                        },
                    },
                    [StatusCodes.BAD_REQUEST]: {
                        description: 'Bad request',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            details: {
                                type: 'array',
                            },
                        },
                    },
                    [StatusCodes.NOT_FOUND]: {
                        description: 'Not found',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            },
        },
        (
            request: FastifyRequest<{
                Params: { userId: string; todoId: string };
                Body: UpdateTodoBody;
            }>,
            reply,
        ) => {
            const todoService = new TodoService(fastify);
            const todoController = new TodoController(todoService);
            todoController.updateTodo(request, reply);
        },
    );

    fastify.delete(
        '/user/:userId/todos/:todoId',
        {
            schema: {
                description: 'Delete todo',
                tags: ['todo'],
                summary: 'Delete a specific todo',
                params: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                        todoId: { type: 'string' },
                    },
                    required: ['userId', 'todoId'],
                },
                response: {
                    [StatusCodes.NO_CONTENT]: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {},
                    },
                    [StatusCodes.BAD_REQUEST]: {
                        description: 'Bad request',
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            details: {
                                type: 'array',
                            },
                        },
                    },
                    [StatusCodes.NOT_FOUND]: {
                        description: 'Not found',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            },
        },
        (
            request: FastifyRequest<{
                Params: { userId: string; todoId: string };
            }>,
            reply,
        ) => {
            const todoService = new TodoService(fastify);
            const todoController = new TodoController(todoService);
            todoController.deleteTodo(request, reply);
        },
    );
}
