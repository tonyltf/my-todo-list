import { createUser } from '@/api';
import { useQuery } from '@tanstack/react-query';

export const useCreateUser = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: createUser,
    });
};
