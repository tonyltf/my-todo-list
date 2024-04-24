import Cookies from 'js-cookie';

import { useQuery } from '@tanstack/react-query';

import { TodoList } from './TodoList';
import { createUser } from '../../api/api';
import { ErrorPage } from '../../pages/ErrorPage';

const cookieName = import.meta.env.VITE_USER_ID_COOKIES_NAME;

export const Todos: React.FC = () => {
    const userId = Cookies.get(cookieName);

    if (userId) {
        return <TodoList userId={userId} />;
    }

    const { isSuccess, isError, data, error } = useQuery({
        queryKey: ['users'],
        queryFn: createUser,
    });
    if (isError) {
        return <ErrorPage error={error} />;
    }
    if (isSuccess) {
        Cookies.set(cookieName, data.id);
        return <TodoList userId={data.id} />;
    }
};
