import { NewTodo, Todo, Todos } from '../types/todo';

export enum TODO_ACTION {
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
    | { type: TODO_ACTION.FETCH_INIT_TODOS }
    | { type: TODO_ACTION.SET_INITIAL_TODOS; payload: Todos }
    | { type: TODO_ACTION.SET_FETCH_ERROR; payload: Error }
    | { type: TODO_ACTION.ADD_TODO; payload: NewTodo }
    | { type: TODO_ACTION.EDIT_TODO; id: string; name: string }
    | { type: TODO_ACTION.TOGGLE_TODO; id: string }
    | { type: TODO_ACTION.REMOVE_TODO; id: string };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case TODO_ACTION.FETCH_INIT_TODOS:
            return { ...state, isLoading: true, error: null };
        case TODO_ACTION.SET_INITIAL_TODOS:
            return {
                ...state,
                isLoading: false,
                error: null,
                todos: action.payload,
            };
        case TODO_ACTION.ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload],
            };
        case TODO_ACTION.EDIT_TODO:
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.id
                        ? { ...todo, name: action.name }
                        : todo,
                ),
            };
        case TODO_ACTION.TOGGLE_TODO:
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.id
                        ? { ...todo, isCompleted: !todo.isCompleted }
                        : todo,
                ),
            };
        case TODO_ACTION.REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.id),
            };
        default:
            return state;
    }
};
