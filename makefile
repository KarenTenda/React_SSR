IMAGE_NAME=phantom_interface_v1
CONTAINER_NAME=phantom_interface_v1
ENV_FILE ?= .env
MODE ?= prod 

ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif

build:
	@echo "Building Docker image in $(MODE) mode..."
	docker build --no-cache -t $(IMAGE_NAME) --build-arg MODE=$(MODE) .

build-dev:
	@echo "Building Docker image for development..."
	docker build --no-cache -t $(IMAGE_NAME)-dev --build-arg MODE=dev .

build-prod:
	@echo "Building Docker image for production..."
	docker build --no-cache -t $(IMAGE_NAME) --build-arg MODE=prod .

run:
	@echo "Running container with ENV_FILE=$(ENV_FILE), VITE_PORT=$(VITE_PORT), JSON_SERVER_PORT=$(VITE_JSON_SERVER_PORT)"
	docker run --env-file $(ENV_FILE) \
	           -p $(VITE_PORT):$(VITE_PORT) \
	           -p $(VITE_JSON_SERVER_PORT):$(VITE_JSON_SERVER_PORT) \
	           --name $(CONTAINER_NAME) $(IMAGE_NAME)

run-dev:
	@echo "Running container in development mode..."
	docker run --rm -it --env-file $(ENV_FILE) \
	           -p $(VITE_PORT):$(VITE_PORT) \
	           -p $(VITE_JSON_SERVER_PORT):$(VITE_JSON_SERVER_PORT) \
	           -v $(PWD):/app $(IMAGE_NAME)-dev

run-prod:
	@echo "Running container in production mode..."
	docker run --rm -d --env-file $(ENV_FILE) \
	           -p $(VITE_PORT):$(VITE_PORT) \
	           -p $(VITE_JSON_SERVER_PORT):$(VITE_JSON_SERVER_PORT) \
	           --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	@echo "Stopping container..."
	-docker stop $(CONTAINER_NAME)
	-docker rm $(CONTAINER_NAME)

clean:
	@echo "Removing Docker image..."
	-docker rmi $(IMAGE_NAME)
