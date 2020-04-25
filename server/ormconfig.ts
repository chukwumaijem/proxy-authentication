import envs from './src/config/app';

export = {
  ...envs.database,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src/modules',
    migrationsDir: 'src/migrations',
  },
};
