APP := sonic-bridge-validator-service
TAG := $(shell git rev-list --count HEAD)

AWS_REGION                  ?= us-west-2
DOCKER_REGISTRY             ?=
AWS_ACCESS_KEY_ID           ?=
AWS_SECRET_ACCESS_KEY       ?=
AWS_SESSION_TOKEN           ?=
AWS_WEB_IDENTITY_TOKEN_FILE ?=
AWS_ROLE_ARN                ?=

.PHONY: build clean tool lint help

# CI Pipeline
all: docker-login build push

docker-login:
ifeq ($(AWS_WEB_IDENTITY_TOKEN_FILE),)
	docker run --rm -i \
		--env AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
		--env AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
		--env AWS_SESSION_TOKEN=$(AWS_SESSION_TOKEN) \
		--env AWS_REGION=$(AWS_REGION) \
		amazon/aws-cli ecr get-login-password --region $(AWS_REGION) \
	| docker login --username AWS --password-stdin $(DOCKER_REGISTRY)
else
	docker run --rm -i \
		--env AWS_REGION=$(AWS_REGION) \
		--env AWS_ROLE_ARN=$(AWS_ROLE_ARN) \
		--env AWS_WEB_IDENTITY_TOKEN_FILE=/tmp/token \
		-v $(AWS_WEB_IDENTITY_TOKEN_FILE):/tmp/token:ro \
		amazon/aws-cli ecr get-login-password --region $(AWS_REGION) \
	| docker login --username AWS --password-stdin $(DOCKER_REGISTRY)
endif

build :
	docker build --pull -t ${DOCKER_REGISTRY}/${APP}:${TAG} -t ${DOCKER_REGISTRY}/${APP}:latest .

push :
	docker push ${DOCKER_REGISTRY}/${APP}:${TAG}
	docker push ${DOCKER_REGISTRY}/${APP}:latest
