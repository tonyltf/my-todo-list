import { Todo } from '../../types/todo';

interface TodoItemProps {
    item: Todo[0];
}

export const TodoItem: React.FC<TodoItemProps> = ({ item }: TodoItemProps) => {
    return <>{item}</>;
};
