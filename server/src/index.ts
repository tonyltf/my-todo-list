import fastify, { FastifyRequest } from 'fastify';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';
import fastifyPostgres from '@fastify/postgres';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { env } from './config';
import userRoute from './routes/user.route';
import todoRoute from './routes/todo.route';

const server = fastify();

const main = async () => {

  await server.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Todo API',
        description: 'A simple API to todo list',
        version: '0.1.0'
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Development server'
        }
      ],
      tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'todo', description: 'TODO list related end-points' },
      ],
      components: {
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      }
    }
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    initOAuth: {},
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next(); },
      preHandler: function (request, reply, next) { next(); }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });

  server.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      reply.status(400).send({ error: 'Validation failed', details: error.validation });
    } else {
      reply.send(error);
    }
  });

  server.register(fastifyPostgres, {
    connectionString: env.DATABASE_URL,
  });

  server.register(fastifyCors, () => {
    return (req: FastifyRequest, callback: (error: Error | null, corsOptions?: FastifyCorsOptions) => void) => {
      const corsOptions: FastifyCorsOptions = {
        origin: env.CORS_ORIGINS,
      };

      // do not include CORS headers for requests from localhost
      if (req.headers.origin && /^localhost$/m.test(req.headers.origin)) {
        corsOptions.origin = false;
      }

      // callback expects two parameters: error and options
      callback(null, corsOptions);
    };
  });

  server.get('/health', async () => {
    return 'OK';
  });

  server.register(userRoute, { prefix: '/v1' });
  server.register(todoRoute, { prefix: '/v1' });

  server.listen({ host: env.HOSTNAME, port: env.PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

main();