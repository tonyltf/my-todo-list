import { List } from 'antd';
import { useContext, useEffect } from 'react';

import { getTodos } from '@/api';
import { TodoContext } from '@/context/TodoContext';
import { ErrorPage } from '@/pages/ErrorPage';
import { TodoAction } from '@/reducer/TodoReducer';
import { useQuery } from '@tanstack/react-query';

import { TodoItem } from './TodoItem';
import { AddTodoItem } from './AddTodoItem';

export const TodoList: React.FC<{ userId: string }> = ({
    userId,
}: {
    userId: string;
}) => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('TodoList must be used within a TodoProvider');
    }

    const { state, dispatch } = context;
    const {
        isLoading,
        isError,
        data = [],
        error,
    } = useQuery({
        queryKey: ['todos', userId],
        queryFn: () => getTodos(userId),
    });
    if (isError) {
        dispatch({ type: TodoAction.SET_FETCH_ERROR, payload: error });
        return;
    }
    useEffect(() => {
        dispatch({ type: TodoAction.SET_INITIAL_TODOS, payload: data });
    }, [data]);

    if (state.error) {
        return <ErrorPage error={state.error} />;
    }

    return (
        <List
            loading={isLoading}
            header={<div>Todo List</div>}
            itemLayout="horizontal"
            footer={<AddTodoItem />}
            bordered
            size="large"
            grid={{ column: 1 }}
            dataSource={state.todos}
            renderItem={(todo) => <TodoItem item={todo} />}
        />
    );
};
