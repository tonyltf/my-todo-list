import { z } from 'zod';
import type { paths } from './schema';

export type Todos =
    paths['/v1/user/{userId}/todos']['get']['responses']['200']['content']['application/json'];
export type NewTodo =
    paths['/v1/user/{userId}/todos']['post']['responses']['201']['content']['application/json'];
export type Todo = Todos[0];

const MAX_TODO_NAME_LENGTH = 100;

export const todoSchema = z.object({
    name: z.string().trim().min(1).max(MAX_TODO_NAME_LENGTH),
});

export type TodoSchema = z.infer<typeof todoSchema>;
