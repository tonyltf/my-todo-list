import { FastifyInstance } from 'fastify';
import { UserService } from './user.service';
import { PostgresDb } from '@fastify/postgres';

jest.mock('fastify');

describe('UserService', () => {
    let userService: UserService;
    let mockFastify: FastifyInstance;

    beforeEach(() => {
        mockFastify = {
            pg: {
                connect: jest.fn().mockResolvedValue({
                    query: jest.fn().mockResolvedValue({
                        rows: [{ id: '123' }],
                    }),
                    release: jest.fn(),
                }),
            } as unknown as PostgresDb & Record<string, PostgresDb>,
        } as unknown as FastifyInstance;

        userService = new UserService(mockFastify as unknown as FastifyInstance);
    });

    describe('createUser', () => {
        it('should create a new user and return the user ID', async () => {
            // Call the createUser method
            const userId = await userService.createUser();

            // Verify that the fastify.pg.connect method was called
            expect(mockFastify.pg.connect).toHaveBeenCalled();

            // Verify that the client.query method was called with the correct SQL query
            expect((await mockFastify.pg.connect()).query).toHaveBeenCalledWith('INSERT INTO "user" (created_at, updated_at) VALUES (current_timestamp, current_timestamp) RETURNING id');

            // Verify that the user ID is returned correctly
            expect(userId).toBe('123');
        });
    });
});