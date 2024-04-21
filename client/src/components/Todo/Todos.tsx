import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';

import { TodoList } from './TodoList';
import { NewUser } from '../User/NewUser';
import { getTodos } from '../../api/api';
import { ErrorPage } from '../../pages/ErrorPage';

const cookieName = import.meta.env.VITE_USER_ID_COOKIES_NAME;

export const Todos: React.FC = () => {
    const userId = Cookies.get(cookieName);
    console.log({ userId });
    if (!userId) {
        return <NewUser />;
    }

    const { isError, isFetching, data, error } = useQuery({
        queryKey: ['todos', userId],
        queryFn: () => getTodos(userId),
    });

    if (isError) {
        return <ErrorPage error={error} />;
    }

    return <TodoList isLoading={isFetching} todos={data} />;
};
