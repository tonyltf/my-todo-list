import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';

import { createUser } from '../../api/api';

const cookieName = import.meta.env.VITE_USER_ID_COOKIES_NAME;

export const NewUser: React.FC = () => {
    const { isSuccess, isError, data, error } = useQuery({
        queryKey: ['users'],
        queryFn: createUser,
    });
    if (isError) {
        console.error(error);
    }
    if (isSuccess) {
        Cookies.set(cookieName, data.id);
    }

    return <></>;
};
