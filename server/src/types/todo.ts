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

export type UpdateTodoBody = Partial<Pick<Todo, 'name' | 'isCompleted'>>;