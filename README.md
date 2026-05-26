# Epic Vue Frontend (See /server/ReadMe.md for server introductory)

## Build Setup

Node -v is v10.8.0
Learn more about vue cli here <https://cli.vuejs.org/>

```bash
# install dependencies for client
npm install
# install dependencies for server
cd server
npm install

# After done installing dependencies go back to root folder
cd ..

# serve with hot reload at http://localhost:44661/
npm run serve

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# GUI for managing project
vue ui
```

## Docker Setup

Setup

```bash
docker network create http_network
docker network create local_prisma
```

Run

```bash
docker-compose up -d
docker run -d -p 6379:6379 redis
```

.env

```bash
COMPOSE_CONVERT_WINDOWS_PATHS=1

# Your domain name (eg. domain.tld)
APP_DOMAIN=localhost

# Docker volumes parent folder
#VOLUMES_ROOT_PATH=/mnt/docker
VOLUMES_ROOT_PATH=.

# Docker containers restart mode
# https://docs.docker.com/compose/compose-file/#restart
RESTART_MODE=unless-stopped

# PRISMA
PORT=4466
CLUSTER_ADDRESS=http://prisma.localhost:${PORT}
SCHEMA_MANAGER_SECRET=mysecret123
SCHEMA_MANAGER_ENDPOINT=http://prisma.localhost:${PORT}/cluster/schema
```

## Documentation

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Debugging

Install the Visual Studio Code Extension "Debugger for Chrome". in the .vscode folder, you should hava a launch.json file, if you do not, create one, it should have the following configuration in it (you may need to change the url to match your environment)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:4467",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

Start your dev environment as normal, then switch to the debugging tab, select the vuejs: chrome configuration and hit f5, or the green arrow. You will need to be cautious about your placement of breakpoints, as Vue may render/run everything once (triggering the breakpoint)

## Error Reporting - Rollbar

[rollbar.js](https://rollbar.com/docs/notifier/rollbar.js/)
Only for use in production environments

```js
//Use Rollbar anywhere in your Vue app.
Vue.rollbar.error('Error!')
// or in a vue component
this.rollbar.error('Error!')
```

## Vue Apollo

<https://github.com/Akryum/vue-cli-plugin-apollo>

Graphql
<https://github.com/apollographql/graphql-tag>

## Login

TODO

## Seed Files

There are a few methods for running the seed file:

```bash
cd server
npx prisma1 seed
```

```bash
cd server
npx graphql query database/seed.graphql
```

This last section will allow you to select what database you want to run against, and what query you want to run

## Minio Information

Go to <https://github.com/minio/minio>
run these two commands in a terminal:

```bash
docker pull minio/minio
docker run -p 9000:9000 minio/minio server /data
```

Make sure you save your access key and secret key, you will need these again

Go to:
<http://localhost:9000> to verify minio loads (you should see a page asking you to log in)
(This address may be different for you depending on what your localhost is)

Enter the secret key and access key you were provided above
in the lower right hand side,

- click the plus sign
- click create bucket
- name it 'upload'

download the appropriate Minio Client binary from <https://github.com/minio/mc>
open up command prompt and cd to that folder

run

```bash
mc
```

to verify that you are able to enter commands, Once this is verified

Run the following commands:

```bash
mc config host add minio YOUR_MINIO_ENDPOINT KEY_ID ACCESS_KEY
```

then, to add the download policy to a bucket, use:

```bash
mc policy download minio/BUCKETNAME
```

Update your .ENV file with the following information

```js
S3_ACCESS_KEY_ID = YOUR_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY = YOUR_SECRET_ACCESS_KEY
S3_EXTERNAL_ENDPOINT = YOUR_MINIO_EXTERNAL_ENDPOINT
S3_ENDPOINT = YOUR_MINIO_ENDPOINT
S3_BUCKET = YOUR_MINIO_BUCKET
```

Documentation:

<https://docs.minio.io/>

## Creating Workspaces

Add Workspace

Add your prisma endpoint url to yout .env file

WORKSPACE_ENDPOINT=<http://localhost:4466/>

Navigate to Dev-->Workspaces
Click 'Add Workspace' and enter a 'workspace name'

Once the endpoint is available you can choose the workspace in the top right corner nav and you can add data

## Prisma Update

Run command:

```bash
cd server
npm i -g prisma@VERSION
```

Update Prisma Version in docker-compose.yml file
stop Prisma in Kitematic

run command:

```bash
cd..
docker-compose up -d prisma
```

## Cypress End to End Tests

These tests currently should be run using the command:

```bash
npm run test:e2e
```

Note: in a secondary terminal, you will also need to run:

```bash
npm run serve
```

The login script assumes you already have an fake admin account using

```bash
admin@admin.com
admin
```

## Component/Mixin/Helper Useage

### Helper Functions (mixins)

import mixins:

```js
import helpers from '@/shared/mixins/helpers'
```

register the mixin with your component by adding:

```js
mixins: [helpers]
```

mixins should be global helper functions that could be called from any page and still be relevant

### Light or Dark Colors

import lightOrDark from '@/shared/mixins/lightOrDark'

```js
mixins: [lightOrDark]
```

```html
<span
  class="tag"
  style="background-color:#4682B4"
  :class="lightOrDark('#4682B4')"
  >Something</span
>
```

Pass the background-color to the function, which will return a bulma class, either has-text-dark or has-text-light

### Media Dashboard Widgets

We have a number of dashboard widgets:

- Media Profiles
- Media Posts (all)(With the ability to pass prop for type e.g. all, published, scheduled, drafts etc)

You can use these anywhere within the application:

Imports

```js
import PostCount from '../media/components/widgets/post-count'
```

Add your components

```js
components: {
  PostCount
}
```

Use component within your template:

```html
<post-count :type="drafts" />
```

### Datepicker

### Geocoder

### Fileuploader

### ImagePicker

### Breadcrumb

the component is globally registered with vue, to use on a page:

```html
<breadcrumb :currentPage="OPTIONAL_DATA_DRIVEN_STRING" />
```

the breadcrumb component uses a breadcrumb array in the router table, this is added to the meta object like this:

```js
          meta: {
            title: 'EPIC Media - Sites',
            breadcrumb: [
              {
                name: 'Sites',
                link: '/media/sites',
                icon: 'fas fa-bookmark'
              }
            ]
          },
```

if you do not need a link or icon leave these values empty: `icon: ''`

### Number Formats

This is a globally registered mixin, use it similiar to the vue filter of the same name:

```js
numberFormat(VARIABLE, 'currency')
```

### Date Formats

This is a globally registered mixin, use it similiar to the vue filter of the same name:

```js
dateFormat(VARIABLE, 'dtg')
```

### Truncate
