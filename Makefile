
all:	build

build:
	@docker-compose build
	@echo "Build done"
	@echo "Run 'make up' to start the project"	

up:
	@docker-compose up

down:
	@docker-compose down

ps:
	@docker-compose ps

fclean:	down
	@if [ -n "$$(sudo docker ps -a -q)" ]; then sudo docker rm -f $$(sudo docker ps -a -q); fi
	@if [ -n "$$(sudo docker images -q)" ]; then sudo docker rmi -f $$(sudo docker images -q); fi
	@if [ -n "$$(sudo docker volume ls -q)" ]; then sudo docker volume prune -f; fi

re: fclean all

.PHONY:	all up down ps fclean re
