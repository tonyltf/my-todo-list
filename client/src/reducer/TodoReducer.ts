import { NewTodo, Todo, Todos } from '../types/todo';

export enum TodoAction {
    FETCH_INIT_TODOS = 'FETCH_INIT_TODOS',
    SET_INITIAL_TODOS = 'SET_INITIAL_TODOS',
    SET_FETCH_ERROR = 'SET_FETCH_ERROR',
    ADD_TODO = 'ADD_TODO',
    EDIT_TODO = 'EDIT_TODO',
    TOGGLE_TODO = 'TOGGLE_TODO',
    REMOVE_TODO = 'REMOVE_TODO',
}

export type State = {
    isLoading: boolean;
    error: Error | null;
    todos: Todo[];
};

export type Action =
    | { type: TodoAction.FETCH_INIT_TODOS }
    | { type: TodoAction.SET_INITIAL_TODOS; payload: Todos }
    | { type: TodoAction.SET_FETCH_ERROR; payload: Error }
    | { type: TodoAction.ADD_TODO; payload: NewTodo }
    | { type: TodoAction.EDIT_TODO; id: string; name: string }
    | { type: TodoAction.TOGGLE_TODO; id: string }
    | { type: TodoAction.REMOVE_TODO; id: string };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case TodoAction.FETCH_INIT_TODOS:
            return { ...state, isLoading: true, error: null };
        case TodoAction.SET_INITIAL_TODOS:
            return {
                ...state,
                isLoading: false,
                error: null,
                todos: action.payload,
            };
        case TodoAction.ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload],
            };
        case TodoAction.EDIT_TODO:
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.id
                        ? { ...todo, name: action.name }
                        : todo,
                ),
            };
        case TodoAction.TOGGLE_TODO:
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.id
                        ? { ...todo, isCompleted: !todo.isCompleted }
                        : todo,
                ),
            };
        case TodoAction.REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.id),
            };
        default:
            return state;
    }
};
