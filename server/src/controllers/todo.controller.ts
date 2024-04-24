import { FastifyReply, FastifyRequest } from "fastify";

import { CreateTodoBody, Todo, TodoDbModel, UpdateTodoBody } from "../types";
import { TodoService } from "../services/todo.service";

export class TodoController {
    todoService: TodoService;

    constructor(todoService: TodoService) {
        this.todoService = todoService;
    }

    static transformTodo(todo: TodoDbModel): Todo {
        return {
            id: todo.id,
            name: todo.name,
            userId: todo.user_id,
            isEnabled: todo.is_enabled,
            isCompleted: todo.is_completed,
            completedAt: todo.completed_at,
            createdAt: todo.created_at,
            updatedAt: todo.updated_at,
        };
    }

    async getTodo(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
        const { userId } = request.params;
        const allTodo = await this.todoService.getTodoForUser({ userId });
        reply.status(200).send(allTodo.map(todo => TodoController.transformTodo(todo)));
    }

    async createTodo(request: FastifyRequest<{ Params: { userId: string }; Body: CreateTodoBody }>, reply: FastifyReply) {
        const { userId } = request.params;
        const todoData = request.body;
        const newTodo = await this.todoService.createTodoForUser({ userId, todoData });
        if (!newTodo) {
            reply.status(500).send({ message: 'Failed to create todo' });
            return;
        }
        reply.status(201).send(TodoController.transformTodo(newTodo));
    }

    async updateTodo(request: FastifyRequest<{ Params: { userId: string; todoId: string; }; Body: UpdateTodoBody }>, reply: FastifyReply) {
        const { userId, todoId } = request.params;
        const todoData = request.body;

        const existingTodo = await this.todoService.getTodoById({ userId, todoId });
        if (!existingTodo) {
            reply.status(404).send({ message: 'Todo not found' });
            return;
        }

        await this.todoService.updateTodo({
            userId, todoId, todoData: {
                name: existingTodo.name,
                isCompleted: existingTodo.is_completed,
                ...todoData,
            }
        });
        reply.status(204).send();
    }

    async deleteTodo(request: FastifyRequest<{ Params: { userId: string; todoId: string; }; }>, reply: FastifyReply) {
        const { userId, todoId } = request.params;

        const existingTodo = await this.todoService.getTodoById({ userId, todoId });
        if (!existingTodo) {
            reply.status(404).send({ message: 'Todo not found' });
            return;
        }

        await this.todoService.deleteTodo({ userId, todoId });
        reply.status(204).send();
    }
}
