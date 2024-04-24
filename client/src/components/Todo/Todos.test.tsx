import React from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todos } from './Todos';

const server = setupServer(
    http.get('/greeting', () => {
        return HttpResponse.json({ greeting: 'hello there' });
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays greeting', async () => {
    render(<Todos />);

    fireEvent.click(screen.getByText('Load Greeting'));

    await screen.findByRole('heading');

    expect(screen.getByRole('heading')).toHaveTextContent('hello there');
    expect(screen.getByRole('button')).toBeDisabled();
});

test('handles server error', async () => {
    server.use(
        http.post('/v1/user', () => {
            return new HttpResponse(null, { status: 500 });
        }),
    );

    render(<Todos />);

    fireEvent.click(screen.getByText('Load Greeting'));

    await screen.findByRole('alert');

    expect(screen.getByRole('alert')).toHaveTextContent(
        'Oops, failed to fetch!',
    );
    expect(screen.getByRole('button')).not.toBeDisabled();
});
