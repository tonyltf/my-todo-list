import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { TodoContext } from '../../context/TodoContext';
import { TODO_ACTION } from '../../reducer/TodoReducer';
import { createTodo } from '../../api/api';
import { Button, Form, Input } from 'antd';

const cookieName = import.meta.env.VITE_USER_ID_COOKIES_NAME;

export const AddTodoItem: React.FC = () => {
    const context = useContext(TodoContext);
    const [name, setName] = useState('');

    if (!context) {
        throw new Error('TodoList must be used within a TodoProvider');
    }
    const userId = Cookies.get(cookieName);
    const { mutateAsync } = useMutation({
        mutationFn: (name: string) => createTodo(userId!, { name }),
    });

    const { dispatch } = context;

    const handleSubmit = async () => {
        if (!name.trim()) return;

        try {
            const newTodo = await mutateAsync(name);
            if (newTodo) {
                dispatch({ type: TODO_ACTION.ADD_TODO, payload: newTodo });
            }
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
        setName('');
    };

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Add new todo"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Add Todo
                </Button>
            </Form.Item>
        </Form>
    );
};
