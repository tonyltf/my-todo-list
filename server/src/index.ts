import fastify from 'fastify';
import todo from './routes/todo';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from './config';

const server = fastify();

const main = async () => {

  await server.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Test swagger',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0'
      },
      servers: [
        {
          url: `http://localhost`,
          description: 'Development server'
        }
      ],
      tags: [
        { name: 'todo', description: 'TODO list related end-points' },
      ],
      components: {
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      }
    }
  })

  await server.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    initOAuth: {},
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  })

  server.get('/health', async () => {
    return 'OK';
  });

  server.register(todo, { prefix: '/v1' });

  server.listen({ host: env.HOSTNAME, port: env.PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

main();