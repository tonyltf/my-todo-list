import { FastifyReply, FastifyRequest } from "fastify";

import { TodoService } from "../services/todo.service";
import { CreateTodoBody, Todo, TodoDbModel, UpdateTodoBody } from "../types";

export class TodoController {
    todoService: TodoService;

    constructor(todoService: TodoService) {
        this.todoService = todoService;
    }

    static transformTodo(todos: TodoDbModel[]): Todo[] {
        return todos.map((todo) => ({
            id: todo.id,
            name: todo.name,
            userId: todo.user_id,
            isEnabled: todo.is_enabled,
            isCompleted: todo.is_completed,
            completedAt: todo.completed_at,
            createdAt: todo.created_at,
            updatedAt: todo.updated_at,
        }));
    }

    async getTodo(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
        const { userId } = request.params;
        const allTodo = await this.todoService.getTodoForUser({ userId });
        reply.status(200).send(TodoController.transformTodo(allTodo));
    }

    async createTodo(request: FastifyRequest<{ Params: { userId: string }; Body: CreateTodoBody }>, reply: FastifyReply) {
        const { userId } = request.params;
        const todoData = request.body;
        const newTodoId = await this.todoService.createTodoForUser({ userId, todoData });
        reply.status(201).send({ id: newTodoId });
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
                name: todoData.name,
                isCompleted: todoData.isCompleted,
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
