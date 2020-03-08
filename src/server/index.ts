import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import next from 'next';
import { buildSchema } from 'type-graphql';
import graphqlHTTP from 'express-graphql';
import { createConnection } from 'typeorm';
import morgan from 'morgan';

import { logger } from './utilities';
import envs from './config';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  try {
    const connection = await createConnection();
    await connection.runMigrations();
    const schema = await buildSchema({
      resolvers: [__dirname + '/**/*.resolver.ts']
    });

    const server = express();
    server.use(morgan('combined'));
    server.use(
      '/graphql',
      graphqlHTTP({
        schema,
        graphiql: !envs.isProduction
      })
    );

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(envs.PORT, (err: any) => {
      if (err) throw err;
      logger.info(
        `${envs.NODE_ENV} server is ready on http://localhost:${envs.PORT}`
      );
    });
  } catch (error) {
    throw new Error(error);
  }
});
