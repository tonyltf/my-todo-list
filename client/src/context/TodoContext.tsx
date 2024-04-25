import { createContext, ReactNode, useReducer } from 'react';

import { Action, reducer, State } from '@/reducer/TodoReducer';

export const TodoContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        error: null,
        todos: [],
    });

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
            {children}
        </TodoContext.Provider>
    );
};
