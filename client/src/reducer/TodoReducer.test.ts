import { Action, reducer, TodoAction } from './TodoReducer';

describe('reducer', () => {
    it('should handle FETCH_INIT_TODOS action', () => {
        const initialState = { isLoading: false, error: null, todos: [] };
        const action = { type: TodoAction.FETCH_INIT_TODOS } as Action;
        const newState = reducer(initialState, action);
        expect(newState).toEqual({ isLoading: true, error: null, todos: [] });
    });

    it('should handle SET_INITIAL_TODOS action', () => {
        const initialState = { isLoading: true, error: null, todos: [] };
        const todos = [
            {
                id: 'todo-1',
                name: 'Task 1',
                userId: 'user-id-1',
                isCompleted: false,
                isEnabled: true,
                completedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        const action = {
            type: TodoAction.SET_INITIAL_TODOS,
            payload: todos,
        } as Action;
        const newState = reducer(initialState, action);
        expect(newState).toEqual({ isLoading: false, error: null, todos });
    });

    it('should handle ADD_TODO action', () => {
        const initialState = { isLoading: false, error: null, todos: [] };
        const todo = {
            id: 'todo-1',
            name: 'Task 1',
            userId: 'user-id-1',
            isCompleted: false,
            isEnabled: true,
            completedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const action = { type: TodoAction.ADD_TODO, payload: todo } as Action;
        const newState = reducer(initialState, action);
        expect(newState).toEqual({
            isLoading: false,
            error: null,
            todos: [todo],
        });
    });

    // Add tests for other actions...

    it('should return the current state for unknown action types', () => {
        const initialState = { isLoading: false, error: null, todos: [] };
        const action = { type: 'UNKNOWN_ACTION' } as unknown as Action;
        const newState = reducer(initialState, action);
        expect(newState).toEqual(initialState);
    });
});
