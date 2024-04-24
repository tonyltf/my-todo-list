import { Button, Flex, notification } from 'antd';
import Cookies from 'js-cookie';
import { useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { createTodo } from '../../api/api';
import { TodoContext } from '../../context/TodoContext';
import { TodoAction } from '../../reducer/TodoReducer';
import { TodoSchema, todoSchema } from '../../types/todo';

const cookieName = import.meta.env.VITE_USER_ID_COOKIES_NAME;

export const AddTodoItem: React.FC = () => {
    const context = useContext(TodoContext);

    if (!context) {
        throw new Error('TodoList must be used within a TodoProvider');
    }

    const [notificationInstance, contextHolder] =
        notification.useNotification();
    const userId = Cookies.get(cookieName);
    const { mutateAsync } = useMutation({
        mutationFn: (name: string) => createTodo(userId!, { name }),
    });

    const { dispatch } = context;

    const { register, reset, handleSubmit } = useForm({
        defaultValues: {
            name: '',
        },
        resolver: zodResolver(todoSchema),
    });

    const handleAdd = useCallback(async ({ name }: TodoSchema) => {
        await mutateAsync(name, {
            onSuccess: (data) => {
                dispatch({ type: TodoAction.ADD_TODO, payload: data! });
            },
            onError: (error) => {
                notificationInstance.error({
                    message: 'Failed to add todo',
                    description: error.message,
                });
            },
        });
        reset();
    }, []);

    return (
        <>
            {contextHolder}
            <form onSubmit={handleSubmit(handleAdd)}>
                <Flex justify="center" gap="middle">
                    <input {...register('name')} placeholder="Add new todo" />
                    <Button type="primary" htmlType="submit">
                        Add Todo
                    </Button>
                </Flex>
            </form>
        </>
    );
};
