
IMAGE_NAME=react-ssr
CONTAINER_NAME=react-ssr
ENV_FILE ?= .env
NEXT_HOST?=50016

build:
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME) .

run:
	@echo "Running container with ENV_FILE=$(ENV_FILE), NEXT_HOST=$(NEXT_HOST)"
	docker run --env-file $(ENV_FILE) \
	           -p $(NEXT_HOST):$(NEXT_HOST) \
	           --name $(CONTAINER_NAME) $(IMAGE_NAME)


stop:
	@echo "Stopping container..."
	-docker stop $(CONTAINER_NAME)
	-docker rm $(CONTAINER_NAME)

clean:
	@echo "Removing Docker image..."
	-docker rmi $(IMAGE_NAME)
