import { ConfigProvider, theme } from 'antd';
import React, { ReactElement } from 'react';

import { TodoProvider } from '@/context/TodoContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const allTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ConfigProvider
            theme={{
                algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
            }}
        >
            <QueryClientProvider client={queryClient}>
                <TodoProvider>{children}</TodoProvider>
            </QueryClientProvider>
        </ConfigProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: allTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, allTheProviders as wrapper };
