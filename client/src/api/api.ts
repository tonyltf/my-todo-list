import createClient from "openapi-fetch";
import type { paths } from "../types/schema";

const client = createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL });

export const createUser = async () => {
    const { data, error } = await client.POST("/v1/users", {
        body: {},
    });
    if (error) {
        throw error;
    }
    return data;
}

export const getTodos = async (userId: string) => {
    const { data, error } = await client.GET("/v1/user/{userId}/todos", {
        params: {
            path: {
                userId,
            },
        }
    });
    if (error) {
        throw error;
    }
    return data;
}
