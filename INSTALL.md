# Installation Guide

## Quick Start (Without RabbitMQ)

The system can run without RabbitMQ for basic functionality:

```bash
# Install dependencies
npm install

# Setup database (requires PostgreSQL)
npm run setup

# Start server
npm start
```

## Full Installation (With RabbitMQ)

### 1. Install PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE order_platform;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE order_platform TO postgres;
\q
```

### 2. Install RabbitMQ
```bash
sudo apt install rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

### 3. Setup Project
```bash
npm install
npm run setup
```

### 4. Run Components
```bash
# Terminal 1: Start mock vendors
node scripts/mockVendors.js

# Terminal 2: Start main server
npm start

# Terminal 3: Start order worker
npm run worker
```

## Test the System

```bash
# Get products
curl http://localhost:3000/api/products

# Place order
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{"product_id": "PROD001", "quantity": 1}'
```