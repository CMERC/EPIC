## Getting started

```sh
# 1. Install Docker
# If you are on Windows 10 Pro
# 1.a. Install Docker Community Edition for windows on your machine. https://store.docker.com/editions/community/docker-ce-desktop-windows
# 1.b. install Kitematic from docker's right click context menu (right click the icon in your taskbar). Do not log in, do not register
# If you are on Windows 10 Home
# 1.a. Install Docker toolbox(Kitematic comes with the install). Make sure to check vistual box option during installation.
# 1.b. Make sure to add the toolbox path to your environmental variables.


# 2. using the integrated terminal
npm install

# 3. Upon finishing create a .env file in the /Server folder with the following values:

DATABASE_URL="mysql://root:prisma@localhost:3306/default@default"
JWT_SECRET="jwtsecret123"
# These are the twitter API keys required for noise to work
TWITTER_CONSUMER_KEY='6LiToeEjIwWw1aFQgnzp6llIz'
TWITTER_CONSUMER_SECRET='XtiEJXvnZykrnkKsM820HSOjketqdQFoD6AlkLEhXfiOig79tb'
TWITTER_ACCESS_TOKEN_KEY='701468065-nGQkg5fTLEcsf8dJzq0DJfg74gcZZbLXIskhrNSj'
TWITTER_ACCESS_TOKEN_SECRET='5pC8SRb7k6cglS1yqxhCbu7DGFGtVjGhzYoYzw4gRqjnp'
# Add graphql-faker endpoint
FAKER_GRAPHQL_ENDPOINT=http://localhost:9002/graphql
# 4. in the terminal
npm run prisma:client

# 5. Start server (runs on http://localhost:4000) and open GraphQL Playground
npm run dev
```

## Email

```sh
# These environment variables control sending of transactional emails.
# Note: They will only send in NODE_ENV=production environemnts, and will show test emails otherwise
SENDGRID_API_KEY=(sendgrid_apikey)
MAIL_FROM=support@epicready.com
```

## Documentation

### Commands

- `npm run start` starts GraphQL server on `http://localhost:4000`
- `npm run dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
- `npm run playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
- `npm run prisma:client` regenerates Prisma Client from [prisma/schema.prisma](./prisma/schema.prisma)

- Update the env file path(../.env) in server/database/migrateWorkspaces.js
  require('dotenv').config({ path: '../.env' })

run `node migrateWorkspaces.js` in server/database

### Project structure

![](https://imgur.com/95faUsa.png)

| File name 　　　　　　　　　　　　　　 | Description 　　　　　　　　<br><br>                                                                                                                           |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `├── .env`                             | Defines environment variables                                                                                                                                  |
| `├── .graphqlconfig.yml`               | Configuration file based on [`graphql-config`](https://github.com/prisma/graphql-config) (e.g. used by GraphQL Playground).                                    |
| `└── database` (_directory_)           | _Contains all files that are related to the Prisma database service_                                                                                           | \  |
| `├── prisma.yml`                       | The root configuration file for your Prisma database service ([docs](https://www.prismagraphql.com/docs/reference/prisma.yml/overview-and-example-foatho8aip)) |
| `└── datamodel.graphql`                | Defines your data model (written in [GraphQL SDL](https://blog.graph.cool/graphql-sdl-schema-definition-language-6755bcb9ce51))                                |
| `└── src` (_directory_)                | _Contains the source files for your GraphQL server_                                                                                                            |
| `├── index.js`                         | The entry point for your GraphQL server                                                                                                                        |
| `├── schema.graphql`                   | The **application schema** defining the API exposed to client applications                                                                                     |
| `├── resolvers` (_directory_)          | _Contains the implementation of the resolvers for the application schema_                                                                                      |
| `└── generated` (_directory_)          | _Contains generated files_                                                                                                                                     |
| `└── prisma.grapghql`                  | The **Prisma database schema** defining the Prisma GraphQL API                                                                                                 |
