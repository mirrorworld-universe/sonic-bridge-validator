APP := sonic-bridge-validator-service
TAG := $(shell git rev-list --count HEAD)
AWS_ACCESS_KEY_ID := ${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY := ${AWS_SECRET_ACCESS_KEY}

# Default value
AWS_REGION ?= us-west-2
DOCKER_REGISTRY ?= ${DOCKER_REGISTRY}

.PHONY: build clean tool lint help

# CI Pipeline
all: docker-login build push

docker-login:
	docker run --env AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) --env AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) --env AWS_REGION=$(AWS_REGION) --rm -i amazon/aws-cli ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(DOCKER_REGISTRY)

build :
	docker build --pull -t ${DOCKER_REGISTRY}/${APP}:${TAG} -t ${DOCKER_REGISTRY}/${APP}:latest .

push :
	docker push ${DOCKER_REGISTRY}/${APP}:${TAG}
	docker push ${DOCKER_REGISTRY}/${APP}:latest
