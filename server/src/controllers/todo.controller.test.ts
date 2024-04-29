import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateTodoBody, UpdateTodoBody } from 'src/types';

import { TodoService } from '../services/todo.service';
import { TodoController } from './todo.controller';

jest.mock('../services/todo.service'); // Automatically mocks the TodoService

describe('TodoController', () => {
    let todoController: TodoController;
    let mockFastify;

    beforeEach(() => {
        mockFastify = {
            pg: {
                connect: jest.fn().mockResolvedValue({
                    query: jest.fn().mockResolvedValue([
                        { id: 1, title: 'Learn Jest' },
                        { id: 2, title: 'Write Tests' },
                    ]),
                }),
            },
        };

        const mockTodoService = new TodoService(
            mockFastify as unknown as FastifyInstance,
        );
        mockTodoService.getTodoForUser = jest
            .fn()
            .mockResolvedValue([{ id: 1, title: 'Test Todo' }]);

        todoController = new TodoController(mockTodoService);
    });

    describe('transformTodo', () => {
        it('should transform a TodoDbModel into a Todo', () => {
            // Mock the TodoDbModel
            const todoDbModel = {
                id: '76fc0630-1870-416d-b930-a81e9cd7c9f8',
                name: 'hello 1',
                is_completed: false,
                created_at: new Date('2024-04-20T14:41:30.566Z'),
                updated_at: new Date('2024-04-20T14:41:30.566Z'),
                user_id: '81ea0c12-8f25-450e-bdc2-2c67f7ba1001',
                is_enabled: true,
                completed_at: null,
            };

            // Call the transformTodo method
            const transformedTodo = TodoController.transformTodo(todoDbModel);

            // Verify that the transformedTodo has the correct properties
            expect(transformedTodo).toEqual({
                id: '76fc0630-1870-416d-b930-a81e9cd7c9f8',
                name: 'hello 1',
                userId: '81ea0c12-8f25-450e-bdc2-2c67f7ba1001',
                isEnabled: true,
                isCompleted: false,
                completedAt: null,
                createdAt: new Date('2024-04-20T14:41:30.566Z'),
                updatedAt: new Date('2024-04-20T14:41:30.566Z'),
            });
        });
    });

    describe('getTodo', () => {
        it('should return all todo items for a user', async () => {
            // Mock the request and reply objects
            const request = {
                params: {
                    userId: '123',
                },
            } as FastifyRequest<{ Params: { userId: string } }>;

            const reply = {
                status: jest.fn().mockReturnValue({
                    send: jest.fn(),
                }),
            } as unknown as FastifyReply;

            // Mock the todoService.getTodoForUser method
            const todoService = {
                getTodoForUser: jest.fn().mockResolvedValue([
                    {
                        id: '76fc0630-1870-416d-b930-a81e9cd7c9f8',
                        name: 'hello 1',
                        is_completed: false,
                        created_at: '2024-04-20T14:41:30.566Z',
                        updated_at: '2024-04-20T14:41:30.566Z',
                        user_id: '81ea0c12-8f25-450e-bdc2-2c67f7ba1001',
                        is_enabled: true,
                        completed_at: '',
                    },
                ]),
            } as unknown as TodoService;

            // Set the todoService mock in the todoController instance
            todoController.todoService = todoService;

            // Call the getTodo method
            await todoController.getTodo(request, reply);

            // Verify that the todoService.getTodoForUser method was called with the correct userId
            expect(todoService.getTodoForUser).toHaveBeenCalledWith({
                userId: '123',
            });

            // Verify that the reply.send method was called with the correct todo items
            expect(reply.status(200).send).toHaveBeenCalledWith([
                {
                    id: '76fc0630-1870-416d-b930-a81e9cd7c9f8',
                    name: 'hello 1',
                    isCompleted: false,
                    createdAt: '2024-04-20T14:41:30.566Z',
                    updatedAt: '2024-04-20T14:41:30.566Z',
                    userId: '81ea0c12-8f25-450e-bdc2-2c67f7ba1001',
                    isEnabled: true,
                    completedAt: '',
                },
            ]);
        });
    });

    describe('createTodo', () => {
        it('should create a new todo item for a user', async () => {
            // Mock the request and reply objects
            const request = {
                params: {
                    userId: 'useId',
                },
                body: {
                    // Provide the necessary properties for the todoData object
                    // based on the CreateTodoBody type
                },
            } as FastifyRequest<{
                Params: { userId: string };
                Body: CreateTodoBody;
            }>;

            const reply = {
                status: jest.fn().mockReturnValue({
                    send: jest.fn(),
                }),
            } as unknown as FastifyReply;

            // Mock the todoService.createTodoForUser method
            const todoService = {
                createTodoForUser: jest.fn().mockResolvedValue({
                    id: 'newTodoId',
                    name: 'New Todo',
                    user_id: 'useId',
                    is_enabled: true,
                    is_completed: false,
                    completed_at: null,
                    created_at: new Date('2024-04-20T14:41:30.566Z'),
                    updated_at: new Date('2024-04-20T14:41:30.566Z'),
                }),
            } as unknown as TodoService;

            // Set the todoService mock in the todoController instance
            todoController.todoService = todoService;

            // Call the createTodo method
            await todoController.createTodo(request, reply);

            // Verify that the todoService.createTodoForUser method was called with the correct userId and todoData
            expect(todoService.createTodoForUser).toHaveBeenCalledWith({
                userId: 'useId',
                todoData: request.body,
            });

            // Verify that the reply.status(201).send method was called with the correct response
            expect(reply.status(201).send).toHaveBeenCalledWith({
                completedAt: null,
                createdAt: new Date('2024-04-20T14:41:30.566Z'),
                id: 'newTodoId',
                isCompleted: false,
                isEnabled: true,
                name: 'New Todo',
                updatedAt: new Date('2024-04-20T14:41:30.566Z'),
                userId: 'useId',
            });
        });
    });

    describe('updateTodo', () => {
        it('should update an existing todo item for a user', async () => {
            // Mock the request and reply objects
            const request = {
                params: {
                    userId: '123',
                    todoId: '456',
                },
                body: {
                    name: 'Updated Todo',
                    isCompleted: true,
                },
            } as FastifyRequest<{
                Params: { userId: string; todoId: string };
                Body: UpdateTodoBody;
            }>;

            const reply = {
                status: jest.fn().mockReturnValue({
                    send: jest.fn(),
                }),
            } as unknown as FastifyReply;

            // Mock the todoService.getTodoById method
            const existingTodo = {
                id: '456',
                name: 'Existing Todo',
                isCompleted: false,
            };
            const todoService = {
                getTodoById: jest.fn().mockResolvedValue(existingTodo),
                updateTodo: jest.fn().mockResolvedValue(undefined),
            } as unknown as TodoService;

            // Set the todoService mock in the todoController instance
            todoController.todoService = todoService;

            // Call the updateTodo method
            await todoController.updateTodo(request, reply);

            // Verify that the todoService.getTodoById method was called with the correct userId and todoId
            expect(todoService.getTodoById).toHaveBeenCalledWith({
                userId: '123',
                todoId: '456',
            });

            // Verify that the todoService.updateTodo method was called with the correct userId, todoId, and todoData
            expect(todoService.updateTodo).toHaveBeenCalledWith({
                userId: '123',
                todoId: '456',
                todoData: {
                    name: 'Updated Todo',
                    isCompleted: true,
                    ...request.body,
                },
            });

            // Verify that the reply.status(204).send method was called
            expect(reply.status(204).send).toHaveBeenCalled();
        });

        it('should return 404 if the todo item does not exist', async () => {
            // Mock the request and reply objects
            const request = {
                params: {
                    userId: '123',
                    todoId: '456',
                },
                body: {
                    name: 'Updated Todo',
                    isCompleted: true,
                },
            } as FastifyRequest<{
                Params: { userId: string; todoId: string };
                Body: UpdateTodoBody;
            }>;

            const reply = {
                status: jest.fn().mockReturnValue({
                    send: jest.fn(),
                }),
            } as unknown as FastifyReply;

            // Mock the todoService.getTodoById method to return null
            const todoService = {
                getTodoById: jest.fn().mockResolvedValue(null),
            } as unknown as TodoService;

            // Set the todoService mock in the todoController instance
            todoController.todoService = todoService;

            // Call the updateTodo method
            await todoController.updateTodo(request, reply);

            // Verify that the todoService.getTodoById method was called with the correct userId and todoId
            expect(todoService.getTodoById).toHaveBeenCalledWith({
                userId: '123',
                todoId: '456',
            });

            // Verify that the reply.status(404).send method was called with the correct response
            expect(reply.status(404).send).toHaveBeenCalledWith({
                message: 'Todo not found',
            });
        });
    });

    describe('TodoController', () => {
        describe('deleteTodo', () => {
            it('should delete an existing todo item for a user', async () => {
                // Mock the request and reply objects
                const request = {
                    params: {
                        userId: '123',
                        todoId: '456',
                    },
                } as FastifyRequest<{
                    Params: { userId: string; todoId: string };
                }>;

                const reply = {
                    status: jest.fn().mockReturnValue({
                        send: jest.fn(),
                    }),
                } as unknown as FastifyReply;

                // Mock the todoService.getTodoById method
                const existingTodo = {
                    id: '456',
                    name: 'Existing Todo',
                    isCompleted: false,
                };
                const todoService = {
                    getTodoById: jest.fn().mockResolvedValue(existingTodo),
                    deleteTodo: jest.fn().mockResolvedValue(undefined),
                } as unknown as TodoService;

                // Set the todoService mock in the todoController instance
                todoController.todoService = todoService;

                // Call the deleteTodo method
                await todoController.deleteTodo(request, reply);

                // Verify that the todoService.getTodoById method was called with the correct userId and todoId
                expect(todoService.getTodoById).toHaveBeenCalledWith({
                    userId: '123',
                    todoId: '456',
                });

                // Verify that the todoService.deleteTodo method was called with the correct userId and todoId
                expect(todoService.deleteTodo).toHaveBeenCalledWith({
                    userId: '123',
                    todoId: '456',
                });

                // Verify that the reply.status(204).send method was called
                expect(reply.status(204).send).toHaveBeenCalled();
            });

            it('should return 404 if the todo item does not exist', async () => {
                // Mock the request and reply objects
                const request = {
                    params: {
                        userId: '123',
                        todoId: '456',
                    },
                } as FastifyRequest<{
                    Params: { userId: string; todoId: string };
                }>;

                const reply = {
                    status: jest.fn().mockReturnValue({
                        send: jest.fn(),
                    }),
                } as unknown as FastifyReply;

                // Mock the todoService.getTodoById method to return null
                const todoService = {
                    getTodoById: jest.fn().mockResolvedValue(null),
                } as unknown as TodoService;

                // Set the todoService mock in the todoController instance
                todoController.todoService = todoService;

                // Call the deleteTodo method
                await todoController.deleteTodo(request, reply);

                // Verify that the todoService.getTodoById method was called with the correct userId and todoId
                expect(todoService.getTodoById).toHaveBeenCalledWith({
                    userId: '123',
                    todoId: '456',
                });

                // Verify that the reply.status(404).send method was called with the correct response
                expect(reply.status(404).send).toHaveBeenCalledWith({
                    message: 'Todo not found',
                });
            });
        });
    });
});
