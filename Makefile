.PHONY: help dev dev-build prod prod-build stop clean logs db-migrate db-studio

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Start development environment
	docker-compose up

dev-build: ## Build and start development environment
	docker-compose up --build

dev-detached: ## Start development environment in detached mode
	docker-compose up -d

prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up

prod-build: ## Build and start production environment
	docker-compose -f docker-compose.prod.yml up --build

prod-detached: ## Start production environment in detached mode
	docker-compose -f docker-compose.prod.yml up -d

stop: ## Stop all containers
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

stop-volumes: ## Stop all containers and remove volumes
	docker-compose down -v
	docker-compose -f docker-compose.prod.yml down -v

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.prod.yml down -v --rmi all

logs: ## Show logs from all containers
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-db: ## Show database logs
	docker-compose logs -f postgres

db-migrate: ## Run database migrations
	docker-compose exec backend npx prisma migrate deploy

db-studio: ## Open Prisma Studio
	docker-compose exec backend npx prisma studio --hostname 0.0.0.0

shell-backend: ## Open shell in backend container
	docker-compose exec backend sh

shell-db: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d videostream

restart: ## Restart all services
	docker-compose restart

restart-backend: ## Restart backend service
	docker-compose restart backend

ps: ## Show running containers
	docker-compose ps

build: ## Build all images
	docker-compose build

build-backend: ## Build backend image only
	docker-compose build backend

