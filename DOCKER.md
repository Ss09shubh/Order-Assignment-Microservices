# Docker Deployment Guide

## Quick Start with Docker

### 1. Build and Start All Services
```bash
# Build and start all containers
docker-compose up --build -d

# Setup database (run once)
docker-compose exec app npm run setup

# View logs
docker-compose logs -f
```

### 2. Access Services
- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api-docs
- **RabbitMQ Management**: http://localhost:15672 (admin/password)
- **PostgreSQL**: localhost:5432

### 3. Stop Services
```bash
docker-compose down
```

## Microservice Architecture

The Docker setup provides true microservice architecture:

### Services:
1. **postgres** - Database service
2. **rabbitmq** - Message queue service  
3. **app** - Main API service
4. **worker** - Background order processor

### Benefits:
- **Isolated Services**: Each component runs in separate container
- **Scalability**: Can scale workers independently
- **Development**: Consistent environment across machines
- **Production Ready**: Easy deployment to any Docker environment

## Scaling Workers

```bash
# Scale to 3 worker instances
docker-compose up --scale worker=3 -d
```

## Environment Variables

All services use environment variables for configuration:
- Database connection via `DB_*` variables
- RabbitMQ connection via `RABBITMQ_URL`
- Service discovery via Docker networking

## Production Deployment

For production, consider:
- Use Docker Swarm or Kubernetes
- Add health checks
- Configure persistent volumes
- Set up monitoring and logging
- Use secrets management