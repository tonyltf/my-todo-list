import { Button, Checkbox, Form, Input, List } from 'antd';
import Cookies from 'js-cookie';
import { useCallback, useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Todo } from '../../types/todo';
import { TodoContext } from '../../context/TodoContext';
import { TODO_ACTION } from '../../reducer/TodoReducer';
import { deleteTodo, editTodo } from '../../api/api';
import { DeleteOutlined } from '@ant-design/icons';

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
    const userId = Cookies.get(cookieName);
    const { mutateAsync: editTodoAction } = useMutation({
        mutationFn: (params: { name?: string; isCompleted?: boolean }) =>
            editTodo(userId!, id, params),
    });
    const { mutateAsync: deleteTodoAction } = useMutation({
        mutationFn: () => deleteTodo(userId!, id),
    });
    const [updatedName, setUpdatedName] = useState(name);

    const { dispatch } = context;

    const handleEdit = useCallback(async () => {
        await editTodoAction(
            { name: updatedName },
            {
                onSuccess: () => {
                    dispatch({
                        type: TODO_ACTION.EDIT_TODO,
                        id,
                        name: updatedName,
                    }),
                        [id];
                    setIsEditing(false);
                },
            },
        );
    }, [id, updatedName]);

    const handleToggle = useCallback(async () => {
        await editTodoAction(
            { isCompleted: !isCompleted },
            {
                onSuccess: () => {
                    dispatch({ type: TODO_ACTION.TOGGLE_TODO, id });
                },
            },
        );
    }, [id]);

    const handleDelete = useCallback(async () => {
        await deleteTodoAction(undefined, {
            onSuccess: () => {
                dispatch({ type: TODO_ACTION.REMOVE_TODO, id });
            },
        });
    }, [id]);

    return (
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
                <Form onFinish={handleEdit}>
                    <Form.Item>
                        <Input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="Update todo name"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Todo
                        </Button>
                    </Form.Item>
                </Form>
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
    );
};
