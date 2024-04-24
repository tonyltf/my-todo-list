import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

jest.mock('../services/user.service'); // Automatically mocks the UserService

describe('UserController', () => {
    let userController: UserController;
    let mockFastify: FastifyInstance;

    beforeEach(() => {
        const mockUserService = new UserService(mockFastify as unknown as FastifyInstance);
        mockUserService.createUser = jest.fn().mockResolvedValue('123');
        userController = new UserController(mockUserService);
    });

    describe('createUser', () => {
        it('should create a new user and return the user id', async () => {
            // Mock the request and reply objects
            const request = {} as FastifyRequest;
            const reply = {
                status: jest.fn().mockReturnValue({
                    send: jest.fn(),
                }),
            } as unknown as FastifyReply;

            // Call the createUser method
            await userController.createUser(request, reply);

            // Verify that the userService.createUser method was called
            expect(userController.userService.createUser).toHaveBeenCalled();

            // Verify that the reply.status and reply.send methods were called with the correct arguments
            expect(reply.status).toHaveBeenCalledWith(201);
            expect(reply.status(201).send).toHaveBeenCalledWith({ id: '123' });
        });
    });
});