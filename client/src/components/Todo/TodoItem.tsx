import { Button, Checkbox, Flex, List, notification } from 'antd';
import Cookies from 'js-cookie';
import { useCallback, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DeleteOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { Todo, todoSchema, TodoSchema } from '../../types/todo';
import { TodoContext } from '../../context/TodoContext';
import { TodoAction } from '../../reducer/TodoReducer';
import { deleteTodo, editTodo } from '../../api/api';
interface TodoItemProps {
    item: Todo;
}

const cookieName = import.meta.env.VITE_USER_ID_COOKIES_NAME;

export const TodoItem: React.FC<TodoItemProps> = ({
    item: { id, name, isCompleted },
}: TodoItemProps) => {
    const context = useContext(TodoContext);
    const [isEditing, setIsEditing] = useState(false);

    if (!context) {
        throw new Error('TodoList must be used within a TodoProvider');
    }

    const [notificationInstance, contextHolder] =
        notification.useNotification();
    const userId = Cookies.get(cookieName);
    const { mutateAsync: editTodoAction } = useMutation({
        mutationFn: (params: { name?: string; isCompleted?: boolean }) =>
            editTodo(userId!, id, params),
    });
    const { mutateAsync: deleteTodoAction } = useMutation({
        mutationFn: () => deleteTodo(userId!, id),
    });
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name,
        },
        resolver: zodResolver(todoSchema),
    });

    const { dispatch } = context;

    const handleEdit = useCallback(
        async ({ name }: TodoSchema) => {
            await editTodoAction(
                { name },
                {
                    onSuccess: () => {
                        dispatch({
                            type: TodoAction.EDIT_TODO,
                            id,
                            name,
                        }),
                            [id];
                        setIsEditing(false);
                    },
                },
            );
        },
        [id],
    );

    const handleToggle = useCallback(async () => {
        await editTodoAction(
            { isCompleted: !isCompleted },
            {
                onSuccess: () => {
                    dispatch({ type: TodoAction.TOGGLE_TODO, id });
                },
                onError: (error) => {
                    notificationInstance.error({
                        message: 'Failed to toggle todo',
                        description: error.message,
                    });
                },
            },
        );
    }, [id]);

    const handleDelete = useCallback(async () => {
        await deleteTodoAction(undefined, {
            onSuccess: () => {
                dispatch({ type: TodoAction.REMOVE_TODO, id });
            },
            onError: (error) => {
                notificationInstance.error({
                    message: 'Failed to delete todo',
                    description: error.message,
                });
            },
        });
    }, [id]);

    return (
        <>
            {contextHolder}
            <List.Item
                actions={[
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>,
                    <DeleteOutlined
                        onClick={handleDelete}
                        style={{ color: 'red' }}
                    />,
                ]}
            >
                {isEditing ? (
                    <form onSubmit={handleSubmit(handleEdit)}>
                        <Flex justify="center" gap="middle">
                            <input
                                {...register('name')}
                                placeholder="Update todo name"
                            />
                            <Button type="primary" htmlType="submit">
                                Update Todo
                            </Button>
                        </Flex>
                    </form>
                ) : (
                    <List.Item.Meta
                        avatar={
                            <Checkbox
                                checked={isCompleted}
                                onChange={handleToggle}
                            />
                        }
                        title={name}
                    />
                )}
            </List.Item>
        </>
    );
};
