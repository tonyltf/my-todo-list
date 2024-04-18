import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import root from './routes/root';
import { env } from './config';

const server = fastify();

server.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
  return 'pong\n'; ``
});

server.register(root, { prefix: '/v1' });

server.listen({ host: env.HOSTNAME, port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});