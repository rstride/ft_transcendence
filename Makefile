# Makefile for ft_transcendance project

# Phony targets ensure that Make doesn't do something with a file named the same as the command
.PHONY: all build up down ps fclean re logs shell-backend shell-frontend shell-database fast

# Default target executed when no arguments are given to make
all: build
	@docker-compose up

# Build Docker images
build:
	@docker-compose build
	@echo "Build done"

# Start Docker containers
up:
	@docker-compose up -d

# Stop Docker containers
down:
	@docker-compose down -v

# List Docker containers
ps:
	@docker-compose ps 

# Remove Docker containers, images, and volumes
re: fclean all

fast:
	@docker-compose down -v
	@docker-compose up --build

# View logs for all containers
logs:
	@docker-compose logs -f

# Open a shell into the backend container
shell-backend:
	@docker-compose exec backend /bin/sh

# Open a shell into the frontend container
shell-frontend:
	@docker-compose exec frontend /bin/sh

# Open a shell into the database container
shell-database:
	@docker-compose exec database /bin/sh