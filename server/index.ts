import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import next from 'next';
import { buildSchema } from 'type-graphql';
import graphqlHTTP from 'express-graphql';
import { createConnection } from "typeorm";

import envs from './config/';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
  const connection = await createConnection();
  await connection.runMigrations();
  const schema = await buildSchema({
    resolvers: [__dirname + '/**/*.resolver.{ts,js}']
  });

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
    console.log(`${envs.NODE_ENV} Ready on http://localhost:${envs.PORT}`);
  });
});
