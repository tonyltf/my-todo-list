import type { paths } from './schema';

export type Todos =
    paths['/v1/user/{userId}/todos']['get']['responses']['200']['content']['application/json'];
export type NewTodo =
    paths['/v1/user/{userId}/todos']['post']['responses']['201']['content']['application/json'];
export type Todo = Todos[0];
