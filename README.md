<p align="center">
  <a href="https://screensynced.vercel.app/" target="blank"><img src="https://raw.githubusercontent.com/EduardStroescu/PubImages/main/WebsiteImages/screenSynced.jpg" alt="ScreenSynced Preview" /></a>
</p>

# ScreenSynced Backend

### Links to the Frontend:

https://github.com/EduardStroescu/ScreenSynced-FrontEnd - repo
https://screensynced.vercel.app/ - Live Demo

### Links to Backend main page and swagger documentation:

https://screensynced.vercel.app/ - Live Demo
https://screensynced-backend.vercel.app/api/docs - Swagger Documentation

# Introduction

Full-Stack content streaming website using the TMDB API and NestJs along with NeonDb coupled with Prisma, for authentication and bookmarking, and Cloudinary for avatar uploads.

## Technologies Used

- [nestjs](https://nestjs.com/) - API Management
- [prisma](https://www.prisma.io/) - ORM for database management
- [passport](https://www.passportjs.org/) - Authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password Encryption
- [cloudinary](https://github.com/cloudinary/cloudinary_npm) - Avatar Uploads
- [cookie-parser](https://github.com/expressjs/cookie-parser) - Cookie Authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT Authentication
- [dotenv](https://github.com/motdotla/dotenv) - Environment Variables
- [docker](https://www.docker.com/) - Local Development and Testing
- [swagger](https://swagger.io/) - Documentation
- [pactum](https://www.npmjs.com/package/pactum) - E2E Testing
- [github actions](https://github.com/features/actions) - CI/CD

## Description

Recreated the old ScreenSynced backend which was built using ExpressJS and MongoDB and used JWT authentication. The new ScreenSynced backend is built using NestJS and Prisma and uses Docker Potgres for local development and testing, which also includes Pactum for E2E testing. Cloudinary is used for avatar uploads, the same as the old backend. Also included Github Actions for CI/CD.

## Installation

```bash
$ npm install
```

## Setup Environment Variables

### Create a .env file in the root directory and add the following variables:

```bash

# The port to run the server on, defaults to 3333

PORT=

# Change the environment to dev or production

NODE_ENV= e.g dev, production

# The client url tied to the backend

CLIENT_URL=

# The database url tied to the backend. Either Postgres from Docker or a local Postgres instance or NeonDB

DATABASE_URL= e.g postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5434/<POSTGRES_DB>?schema=public

# Postgres credentials for Docker Postgres. ADD IF USING DOCKER POSTGRES FOR LOCAL DEVELOPMENT.

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# JWT secrets for authentication

ACCESS_SECRET=
REFRESH_SECRET=

# Cloudinary credentials for avatar uploads. See https://cloudinary.com/.

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Create a .env.test file in the root directory and add the following variables:

```bash

# The port to run the server on, defaults to 3333

PORT=

# The client url tied to the backend. Defaults to http://localhost:5173 for Vite.

CLIENT_URL=

# The database url tied to the backend. MUST SET UP A DOCKER POSTGRES FOR TESTING PURPOSES LOCALLY AND FOR GITHUB ACTIONS TO PASS.

DATABASE_URL= e.g postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5435/<POSTGRES_DB>?schema=public

# Postgres credentials for Docker Postgres

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# JWT secrets for authentication

ACCESS_SECRET=
REFRESH_SECRET=

# Cloudinary credentials for avatar uploads. See https://cloudinary.com/.

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Running the app

```bash
# watch mode, if using Docker Postgres
$ npm run start:dev:docker

# watch mode, if using NeonDB. DATABASE_URL from .env and .env.test must be set to NeonDB credentials.
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```
