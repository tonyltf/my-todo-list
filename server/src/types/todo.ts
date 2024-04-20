export interface TodoDbModel {
    id: string;
    name: string;
    user_id: string;
    is_enabled: boolean;
    is_completed: boolean;
    completed_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
export interface Todo {
    id: string;
    name: string;
    userId: string;
    isEnabled: boolean;
    isCompleted: boolean;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type NewTodo = Partial<Pick<Todo, 'id'>> & Pick<Todo, 'name' | 'userId' | 'isCompleted' | 'completedAt' | 'createdAt' | 'updatedAt'>;

export type CreateTodoBody = Pick<Todo, 'name'>;

export type UpdateTodoBody = Partial<Pick<Todo, 'name' | 'isCompleted' | 'isEnabled'>>;