import { FastifyInstance } from 'fastify';

export class UserService {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    async createUser(): Promise<string | void> {
        const client = await this.fastify.pg.connect();
        try {
            const { rows } = await client.query<{ id: string }>(
                'INSERT INTO "user" (created_at, updated_at) VALUES (current_timestamp, current_timestamp) RETURNING id',
            );
            return rows[0].id;
        } catch (error) {
            // TODO: use logger instead of console.error
            console.error(error);
        } finally {
            client.release();
        }
    }
}
