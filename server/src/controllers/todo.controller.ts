import { FastifyReply, FastifyRequest } from "fastify";

import { TodoService } from "../services/todo.service";
import { CreateTodoBody, UpdateTodoBody } from "../types";

export class TodoController {
    todoService: TodoService;

    constructor(todoService: TodoService) {
        this.todoService = todoService;
    }

    async getTodo(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
        const { userId } = request.params;
        const allTodo = await this.todoService.getTodoForUser({ userId });
        console.log({ allTodo });
        reply.code(200).header('Content-Type', 'application/json').send(allTodo);
    }

    async createTodo(request: FastifyRequest<{ Params: { userId: string }; Body: CreateTodoBody }>, reply: FastifyReply) {
        const { userId } = request.params;
        const todoData = request.body;
        const newTodoId = await this.todoService.createTodoForUser({ userId, todoData });
        reply.code(201).send({ id: newTodoId });
    }

    async updateTodo(request: FastifyRequest<{ Params: { userId: string; todoId: string; }; Body: UpdateTodoBody }>, reply: FastifyReply) {
        const { userId, todoId } = request.params;
        const todoData = request.body;

        const existingTodo = await this.todoService.getTodoById({ userId, todoId });
        if (!existingTodo) {
            reply.code(404).send({ message: 'Todo not found' });
            return;
        }

        await this.todoService.updateTodo({
            userId, todoId, todoData: {
                name: todoData.name,
                isCompleted: todoData.isCompleted,
                ...todoData,
            }
        });
        reply.code(204).send();
    }

    async deleteTodo(request: FastifyRequest, reply: FastifyReply) {
        return 'TODO';
    }
}
