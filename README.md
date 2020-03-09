# Custom server with TypeScript + Nodemon example

Technologies:
- TypeGraphQL
- TypeORM
- NextJS

## Docker Setup:
run `docker-compose up` to start up a DB instance


# Install it and run:

```bash
cp .env.example .env
yarn
yarn dev
```

Note: You need to ensure your node version matches what's in `.nvmrc`. Or run `nvm use` to use the version

# Migrations:
1- Make the specific schema changes in `./src/entities` folder

2- Make sure that database schema is identical to staging. If its not, follow the above section to reset to the local database.

3- Make sure that your local `.env` file is pointing to the local docker compose db container. IF not sure, run the following:


4- Generate the migration by running the following, and replace `NAME_OF_MIGRATION` with the correct name

``` 
yarn run migration:generate NAME_OF_MIGRATION
```

This will generate a new file in `src/migrations` folder.

5- Run the migration on local database to test. To do that, run:

``` 
yarn run migration:run
```

Then look at database through a PostgreSQL viewer and Hasura console to make sure that is the right change. If it looks its not correct, then revert the migration locally

``` 
yarn run migration:revert
```

Then remote the generated migration files by doing:

``` 
rm -rf src/migrations/NAME_OF_MIGRATION_FILE.ts
```

Then generate a new migration file again by following the instructions above again until the migration looks perfect.

# Entities:
We use [typedi](https://github.com/typestack/typedi) for dependency injection. After creating an entity do not forget to import it into the entities/index.ts file and set it in the typedi container.
```
Container.set({ id: 'EntityName', factory: () => Entity });
```
And in the service, you now inject the entity
```
  @Inject('EntityName')
  private entityVariable = Entity;
```
