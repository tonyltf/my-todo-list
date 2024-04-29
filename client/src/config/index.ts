export const config = {
    apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:9080',
    userIdCookiesName:
        import.meta.env.VITE_USER_ID_COOKIES_NAME ?? 'todo_list_user_id',
};
