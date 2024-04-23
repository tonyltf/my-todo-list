import createClient from 'openapi-fetch';
import type { paths } from '../types/schema';
import { NewTodo } from '../types/todo';

const client = createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL });

export const createUser = async () => {
    const { data, error } = await client.POST('/v1/users', {
        body: {},
    });
    if (error) {
        throw error;
    }
    return data;
};

export const getTodos = async (userId: string) => {
    const { data, error } = await client.GET('/v1/user/{userId}/todos', {
        params: {
            path: {
                userId,
            },
        },
    });
    if (error) {
        throw error;
    }
    return data;
};

export const createTodo = async (
    userId: string,
    todo: { name: string },
): Promise<NewTodo | undefined> => {
    const { data, error } = await client.POST('/v1/user/{userId}/todos', {
        params: {
            path: {
                userId,
            },
        },
        body: todo,
    });
    if (error) {
        throw error;
    }
    return data;
};

export const editTodo = async (
    userId: string,
    todoId: string,
    todo: { name?: string; isCompleted?: boolean },
) => {
    const { error } = await client.PATCH('/v1/user/{userId}/todos/{todoId}', {
        params: {
            path: {
                userId,
                todoId,
            },
        },
        body: todo,
    });
    if (error) {
        throw error;
    }
};

export const deleteTodo = async (userId: string, todoId: string) => {
    const { error } = await client.DELETE('/v1/user/{userId}/todos/{todoId}', {
        params: {
            path: {
                userId,
                todoId,
            },
        },
    });
    if (error) {
        throw error;
    }
};
