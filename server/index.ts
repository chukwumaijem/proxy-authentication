import 'dotenv/config';
import express from 'express';
import next from 'next';
import envs from './config/';

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(envs.PORT, (err: any) => {
    if (err) throw err
    console.log(`${envs.NODE_ENV} Ready on http://localhost:${envs.PORT}`)
  })
});
