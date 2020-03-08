 module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: ['src/server/entities/**/*.ts'],
  migrations: ['src/server/migrations/**/*.ts'],
  subscribers: ['src/server/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/server/entities',
    migrationsDir: 'src/server/migrations',
    subscribersDir: 'src/server/subscriber'
  }
}

export {}