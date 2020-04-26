# Proxy Authentication

A self hosted identity service. Create React App frontend and Nestjs Backend.

## Running with Docker

### Development

Create a .env.local file inside the client foler, copy the content of .env.local.example into it and update the values as needed. Create a .env file inside the server foler, copy the content of .env.example into it and update the values as needed. Always add new env variable to the appropriate .example file but with a dummy value.

If you set your backend PORT value to something other 8000, remember to update it in the docker-compose file, but do not commit this change.

To start the app with simply run `docker-compose up`. If this is the first time this command is run, it will build the all three services needed to run the app: client, server, database. When a new library is installed, remember to run `docker-compose build` before running `up`.


### Production build

We try to flow git flow branching model. if you're not familair with the git-flow model see the summary section. Production image builds should be tagged with the latest published version tags, instead of the word latest, e.g. `docker build -f Dockerfile.prod -t proxy-auth-client:v1.0.1 .`

## Gitflow Summary

- All PRs should be raised against develop.

To create a release:
- Create a release branch from develop with new version tags e.g. release/v1.0.1
- Update package.json version: `npm version patch | minor | major`
- Raise PR with release branch to master.
- Merge release branch to master.
- Update master. Cut tags with latest verion number e.g. `git tag -a v1.0.1`
- Push tags `git push origin --tags`
- Create and publish a release based on the pushed tag.
- Raise and merge a PR from master to develop.
