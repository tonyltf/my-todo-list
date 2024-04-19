import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { TodoController } from './todo.controller';
import { TodoService } from '../services/todo.service';

jest.mock('../services/todo.service'); // Automatically mocks the TodoService

describe('TodoController', () => {
    let todoController: TodoController;
    let mockRequest, mockReply, mockSend, mockFastify;

    beforeEach(() => {
        mockFastify = {
            pg: {
                connect: jest.fn().mockResolvedValue({
                    query: jest.fn().mockResolvedValue([
                        { id: 1, title: 'Learn Jest' },
                        { id: 2, title: 'Write Tests' }
                    ]),
                }),
            },
        };

        const mockTodoService = new TodoService(mockFastify as unknown as FastifyInstance);
        mockTodoService.getTodoForUser = jest.fn().mockResolvedValue([{ id: 1, title: 'Test Todo' }]);

        mockSend = jest.fn();
        mockReply = {
            send: mockSend
        };

        todoController = new TodoController(mockTodoService);
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
                send: jest.fn(),
            } as unknown as FastifyReply;

            // Mock the todoService.getTodoForUser method
            const todoService = {
                getTodoForUser: jest.fn().mockResolvedValue(['todo1', 'todo2']),
            };

            // Set the todoService mock in the todoController instance
            // todoController.todoService = todoService;

            // Call the getTodo method
            await todoController.getTodo(request, reply);

            // Verify that the todoService.getTodoForUser method was called with the correct userId
            expect(todoService.getTodoForUser).toHaveBeenCalledWith({ userId: '123' });

            // Verify that the reply.send method was called with the correct todo items
            expect(reply.send).toHaveBeenCalledWith(['todo1', 'todo2']);
        });
    });

    describe('updateTodo', () => {
        it('should reply 404 if todo is not found', async () => {
            // Mock the request and reply objects
            const request = {
                params: {
                    userId: '123',
                    todoId: '456',
                },
                body: {
                    name: 'Test Todo',
                    isCompleted: false,
                },
            } as FastifyRequest<{ Params: { userId: string, todoId: string }, Body: { name: string, isCompleted: boolean } }>;

            const reply = {
                code: jest.fn(),
                send: jest.fn(),
            } as unknown as FastifyReply;

            // Mock the todoService.getTodoById method
            const todoService = {
                getTodoById: jest.fn().mockResolvedValue(undefined),
            };


        })
    });

});