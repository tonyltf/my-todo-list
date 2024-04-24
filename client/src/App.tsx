import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';
import { Todos } from './components/Todo/Todos';
import { TodoProvider } from './context/TodoContext';

const queryClient = new QueryClient();

function App() {
    return (
        <ConfigProvider
            theme={{
                algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
            }}
        >
            <QueryClientProvider client={queryClient}>
                <TodoProvider>
                    <Todos />
                </TodoProvider>
            </QueryClientProvider>
        </ConfigProvider>
    );
}

export default App;
