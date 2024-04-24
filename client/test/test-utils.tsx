import { ConfigProvider, theme } from 'antd';
import React, { ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

import { TodoProvider } from '../src/context/TodoContext';

const queryClient = new QueryClient();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
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
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
