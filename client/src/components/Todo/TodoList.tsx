import { List } from 'antd';

import { TodoItem } from './TodoItem';
import { Todos } from '../../types/todo';
import { AddTodoItem } from './AddTodoItem';

interface TodoListProps {
    todos?: Todos;
    isLoading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
    isLoading,
    todos,
}: TodoListProps) => {
    return (
        <List
            loading={isLoading}
            header={<div>Todo List</div>}
            itemLayout="horizontal"
            footer={<AddTodoItem />}
            bordered
            size="large"
            grid={{ column: 1 }}
            dataSource={todos}
            renderItem={(todo) => <TodoItem item={todo} />}
        />
    );
};
