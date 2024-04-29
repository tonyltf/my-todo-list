import { FastifyInstance } from 'fastify';
import { TodoService } from './todo.service';
import { PostgresDb } from '@fastify/postgres';

describe('TodoService', () => {
    let todoService: TodoService;
    let mockFastify: FastifyInstance;

    beforeEach(() => {
        mockFastify = {
            pg: {
                connect: jest.fn().mockResolvedValue({
                    query: jest.fn().mockResolvedValue({
                        rows: [
                            { id: 1, title: 'Learn Jest' },
                            { id: 2, title: 'Write Tests' },
                        ],
                    }),
                    release: jest.fn(),
                }),
            } as unknown as PostgresDb & Record<string, PostgresDb>,
        } as unknown as FastifyInstance;

        todoService = new TodoService(mockFastify);
    });

    describe('getTodoForUser', () => {
        it('should return todo items for a user', async () => {
            // Mock the userId
            const userId = '123';

            // Call the getTodoForUser method
            const result = await todoService.getTodoForUser({ userId });

            // Verify that the fastify.pg.connect method was called
            expect(mockFastify.pg.connect).toHaveBeenCalled();

            // Verify that the client.query method was called with the correct SQL query and parameters
            expect((await mockFastify.pg.connect()).query).toHaveBeenCalledWith(
                'SELECT * FROM todo WHERE user_id = $1 AND is_enabled = true ORDER BY created_at ASC',
                [userId],
            );

            // Verify that the result is the expected todo items
            expect(result).toEqual([
                { id: 1, title: 'Learn Jest' },
                { id: 2, title: 'Write Tests' },
            ]);
        });
    });

    describe('getTodoById', () => {
        it('should return a todo item by id for a user', async () => {
            // Mock the userId and todoId
            const userId = '123';
            const todoId = '456';

            // Call the getTodoById method
            const result = await todoService.getTodoById({ userId, todoId });

            // Verify that the fastify.pg.connect method was called
            expect(mockFastify.pg.connect).toHaveBeenCalled();

            // Verify that the client.query method was called with the correct SQL query and parameters
            expect((await mockFastify.pg.connect()).query).toHaveBeenCalledWith(
                'SELECT * FROM todo WHERE id = $1 AND user_id = $2',
                [todoId, userId],
            );

            // Verify that the result is the expected todo item
            expect(result).toEqual({ id: 1, title: 'Learn Jest' });
        });
    });

    describe('createTodoForUser', () => {
        it('should create a todo item for a user', async () => {
            // Mock the userId and todoData
            const userId = '123';
            const todoData = { name: 'New Todo' };

            // Mock the client.query method
            const mockQuery = jest
                .fn()
                .mockResolvedValue({ rows: [{ id: '789' }] });
            const mockRelease = jest.fn();
            const mockConnect = jest
                .fn()
                .mockResolvedValue({ query: mockQuery, release: mockRelease });
            // const mockClient = { query: mockQuery, release: mockRelease };
            const mockFastify = { pg: { connect: mockConnect } };

            // Create a new instance of TodoService with the mockFastify
            const todoService = new TodoService(
                mockFastify as unknown as FastifyInstance,
            );

            // Call the createTodoForUser method
            const result = await todoService.createTodoForUser({
                userId,
                todoData,
            });

            // Verify that the fastify.pg.connect method was called
            expect(mockConnect).toHaveBeenCalled();

            // Verify that the client.query method was called with the correct SQL query and parameters
            expect(mockQuery).toHaveBeenCalledWith(
                `
                INSERT INTO todo (name, user_id, is_completed, created_at, updated_at)
                VALUES ($1, $2, false, current_timestamp, current_timestamp)
                RETURNING *;
                `,
                [todoData.name, userId],
            );

            // Verify that the result is the expected todo item id
            expect(result).toEqual('789');

            // Verify that the client.release method was called
            expect(mockRelease).toHaveBeenCalled();
        });
    });

    describe('updateTodo', () => {
        it('should update a todo item for a user', async () => {
            const userId = '123';
            const todoId = '456';
            const todoData = { name: 'Updated Todo', isCompleted: true };

            const mockQuery = jest
                .fn()
                .mockResolvedValue({ rows: [{ id: '789' }] });
            const mockRelease = jest.fn();
            const mockConnect = jest
                .fn()
                .mockResolvedValue({ query: mockQuery, release: mockRelease });
            const mockFastify = { pg: { connect: mockConnect } };

            const todoService = new TodoService(
                mockFastify as unknown as FastifyInstance,
            );

            const result = await todoService.updateTodo({
                userId,
                todoId,
                todoData,
            });

            expect(mockConnect).toHaveBeenCalled();
            expect(mockQuery).toHaveBeenCalledWith(
                `
                UPDATE todo
                SET name = $1, is_completed = $2, completed_at = $3, updated_at = current_timestamp
                WHERE id = $4 AND user_id = $5
                RETURNING id;
            `,
                [
                    todoData.name,
                    todoData.isCompleted,
                    new Date(),
                    todoId,
                    userId,
                ],
            );

            expect(result).toEqual('789');
            expect(mockRelease).toHaveBeenCalled();
        });
    });

    describe('deleteTodo', () => {
        it('should delete a todo item for a user', async () => {
            const userId = '123';
            const todoId = '456';

            const mockQuery = jest
                .fn()
                .mockResolvedValue({ rows: [{ id: '789' }] });
            const mockRelease = jest.fn();
            const mockConnect = jest
                .fn()
                .mockResolvedValue({ query: mockQuery, release: mockRelease });
            const mockFastify = { pg: { connect: mockConnect } };

            const todoService = new TodoService(
                mockFastify as unknown as FastifyInstance,
            );

            const result = await todoService.deleteTodo({ userId, todoId });

            expect(mockConnect).toHaveBeenCalled();
            expect(mockQuery).toHaveBeenCalledWith(
                `
                UPDATE todo
                SET is_enabled = false, updated_at = current_timestamp
                WHERE id = $1 AND user_id = $2
                RETURNING id
            `,
                [todoId, userId],
            );

            expect(result).toEqual('789');
            expect(mockRelease).toHaveBeenCalled();
        });
    });
});
