import Cookies from 'js-cookie';
import { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TodoList } from './TodoList';
import { TodoContext } from '../../context/TodoContext';
import { NewUser } from '../User/NewUser';
import { TODO_ACTION } from '../../reducer/TodoReducer';
import { getTodos } from '../../api/api';
import { ErrorPage } from '../../pages/ErrorPage';

const cookieName = import.meta.env.VITE_USER_ID_COOKIES_NAME;

export const Todos: React.FC = () => {
    const userId = Cookies.get(cookieName);
    if (!userId) {
        return <NewUser />;
    }

    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('TodoList must be used within a TodoProvider');
    }

    const { state, dispatch } = context;

    const {
        isError,
        data = [],
        error,
    } = useQuery({
        queryKey: ['todos', userId],
        queryFn: () => getTodos(userId),
    });
    if (isError) {
        dispatch({ type: TODO_ACTION.SET_FETCH_ERROR, payload: error });
        return;
    }
    useEffect(() => {
        dispatch({ type: TODO_ACTION.SET_INITIAL_TODOS, payload: data });
    }, [data]);

    if (state.error) {
        return <ErrorPage error={state.error} />;
    }
    return <TodoList isLoading={state.isLoading} todos={state.todos} />;
};
