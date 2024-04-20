import { FastifyInstance } from "fastify";

import { CreateTodoBody, TodoDbModel, UpdateTodoBody } from "../types";

export class TodoService {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async getTodoForUser({ userId }: { userId: string }): Promise<TodoDbModel[]> {
        const client = await this.fastify.pg.connect();
        try {
            const { rows } = await client.query<TodoDbModel>('SELECT * FROM todo WHERE user_id = $1 AND is_enabled = true ORDER BY created_at ASC', [userId]);
            return rows;
        } catch (error) {
            // TODO: use logger instead of console.error
            console.error(error);
        } finally {
            client.release();
        }
        return [];
    }

    async getTodoById({ userId, todoId }: { userId: string, todoId: string }): Promise<TodoDbModel | void> {
        const client = await this.fastify.pg.connect();
        try {
            const { rows } = await client.query<TodoDbModel>('SELECT * FROM todo WHERE id = $1 AND user_id = $2', [todoId, userId]);
            return rows[0];
        } catch (error) {
            // TODO: use logger instead of console.error
            console.error(error);
        } finally {
            client.release();
        }
    }

    async createTodoForUser({ userId, todoData }: { userId: string, todoData: CreateTodoBody }): Promise<string | void> {
        const client = await this.fastify.pg.connect();
        try {
            const { rows } = await client.query<{ id: string }>(`
                INSERT INTO todo (name, user_id, is_completed, created_at, updated_at)
                VALUES ($1, $2, false, current_timestamp, current_timestamp)
                RETURNING id
                `, [todoData.name, userId]);
            return rows[0].id;
        } catch (error) {
            // TODO: use logger instead of console.error
            console.error(error);
        } finally {
            client.release();
        }
    }

    async updateTodo({ userId, todoId, todoData }: { userId: string, todoId: string, todoData: UpdateTodoBody }) {
        const client = await this.fastify.pg.connect();
        try {
            const { rows } = await client.query<{ id: string }>(`
                UPDATE todo
                SET name = $1, isCompleted = $2, updated_at = current_timestamp
                WHERE id = $3 AND user_id = $4
                RETURNING id
            `, [todoData.name, todoData.isCompleted, todoId, userId]);
            return rows[0].id;
        } catch (error) {
            // TODO: use logger instead of console.error
            console.error(error);
        } finally {
            client.release();
        }
    }

    async deleteTodo({ userId, todoId }: { userId: string, todoId: string }) {
        const client = await this.fastify.pg.connect();
        try {
            const { rows } = await client.query<{ id: string }>(`
                UPDATE todo
                SET is_enabled = false, updated_at = current_timestamp
                WHERE id = $3 AND user_id = $4
                RETURNING id
            `, [todoId, userId]);
            return rows[0].id;
        } catch (error) {
            // TODO: use logger instead of console.error
            console.error(error);
        } finally {
            client.release();
        }
    }
}