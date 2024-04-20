import { FastifyReply, FastifyRequest } from "fastify";

import { UserService } from "../services/user.service";

export class UserController {
    userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(_request: FastifyRequest, reply: FastifyReply) {
        const newUserId = await this.userService.createUser();
        reply.status(201).send({ id: newUserId });
    }
}