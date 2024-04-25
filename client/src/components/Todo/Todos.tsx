import Cookies from 'js-cookie';

import { config } from '@/config';
import { useQuery } from '@tanstack/react-query';

import { TodoList } from './TodoList';
import { createUser } from '@/api';
import { ErrorPage } from '@/pages/ErrorPage';

export const Todos: React.FC = () => {
    const cookieName = config.userIdCookiesName;
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
