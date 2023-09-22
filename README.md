# What's the goal of the project?
This project is about creating a web app for the mighty Pong contest!

## Main features
Users can login using the OAuth system of the school's intranet and enable two-factor authentication as well as add friends, see stats of the games they played, invite other users to join a game, etc.
In addition to that, users can send each other direct messages and create chat rooms.
Finally, they can play the mighty Pong game against each other or watch other players busy playing.

## Technical Implementation
- Programming language: Typescript
- Frontend: ReactJS & Material UI
- Runtime environment: NodeJS
- Backend: NestJS
- Database: PostgreSQL
- Containerization: Docker

## How to build the project

### Root setup

- Duplicate 'template.env' and name it '.env'.

###  Backend setup

- Choose a proper jwt secret in src/auth/constants and name it 'constants.ts'.

- Duplicate template.env located at src/common/envs and fill in the details:
	- FORTYTWO_ID and FORTYTWO_APP_SECRET will be given when registrating the app on the intranet of 42
	
- If you want to launch the project with 'make', change the DATABASE_HOST variable in the .env file with 'db'

### Frontend setup

- Duplicate template.env in the frontend root folder and fill the new file (named '.env').

## Run adminer after launching with make

```bash
$ docker run --link database-docker:db --network ft_transcendence_mynetwork --name adminer -p 8080:8080 -d adminer
```

## Run a test database

```bash

# Change the db host in the ./backend/src/common/envs/.env to localhost
# Don't forget to change it to 'db' after if you want to run backend with docker.

# run the database from backend directory
$ docker run -h db --name postgres --env-file .env -p 5432:5432 -d postgres

#run adminer
$ docker run --link postgres:db --name adminer -p 8080:8080 -d adminer

# You can connect to adminer (localhost:8080) with :
# - System : PostgreSQL
# - Server : db
# - Username : postgres
# - Password : password provided in the .env file
# - Database : database name provided in the .env file

# stop testing databases
$ docker stop postgres adminer
$ docker system prune -af
$ docker volume prune -f

```

## Prerequisite

Make sure docker is installed.
If you want to run the project from one of school 42's mac, make sure to first launch the `init_docker.sh` script.
