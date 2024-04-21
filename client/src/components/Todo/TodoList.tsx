import { List } from 'antd';

import { TodoItem } from './TodoItem';
import { Todo } from '../../types/todo';
import { AddTodoItem } from './AddTodoItem';

interface TodoListProps {
    todos?: Todo;
    isLoading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ isLoading, todos }: TodoListProps) => {
    return (
        <List
            loading={isLoading}
            header={<div>Todo List</div>}
            footer={<AddTodoItem />}
            bordered
            size="large"
            dataSource={todos}
            renderItem={(todo) => (
                <List.Item>
                    <TodoItem item={todo} />
                </List.Item>
            )}
        />
    );
};
