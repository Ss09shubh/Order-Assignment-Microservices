# Order Processing Platform

A Node.js-based order processing platform that acts as a stock aggregator, syncing inventories from multiple third-party vendor systems and ensuring consistent order handling under high load.

## Architecture

### Stock Sync Flow
1. **Vendor Integration**: Mock vendors expose stock APIs
2. **Stock Aggregation**: Periodic sync updates local PostgreSQL database
3. **Local Storage**: Maintains vendor stock copies for fast access

### Order Placement Architecture
1. **Order API**: Receives order requests via REST API
2. **Atomic Stock Check**: Database transaction ensures stock consistency
3. **Queue Processing**: RabbitMQ queues orders for async processing
4. **Vendor Updates**: Workers update vendor systems after local processing

### Queue-based Worker Model
- **RabbitMQ**: Durable queues with message persistence
- **Single Processing**: Prefetch=1 ensures one order per worker
- **Retry Logic**: Failed messages are requeued
- **Status Tracking**: Order status updates throughout lifecycle

### Consistency Guarantees
- **Local Consistency**: PostgreSQL transactions prevent overselling
- **Vendor Sync**: Eventual consistency with vendor systems
- **Atomic Operations**: Stock reservation and order creation in single transaction
- **Concurrency Safety**: Database-level locking prevents race conditions

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- RabbitMQ 3.8+ (optional)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
Edit `.env` file with your database and RabbitMQ settings.

3. **Setup database**:
```bash
npm run setup
```

4. **Start mock vendors** (in separate terminal):
```bash
node scripts/mockVendors.js
```

5. **Start main server**:
```bash
npm start
```

6. **Start order worker** (in separate terminal):
```bash
npm run worker
```

### Commands

- **Stock Sync**: `npm run sync` - Sync stock from all vendors
- **Setup Database**: `npm run setup` - Create tables and sample data
- **Start Server**: `npm start` - Start main API server
- **Start Worker**: `npm run worker` - Start order processing worker
- **Development**: `npm run dev` - Start with nodemon

## API Endpoints

### Documentation
- **Swagger UI**: `http://localhost:3000/api-docs` - Interactive API documentation

### System
- `GET /health` - Server health status
- `GET /status` - Detailed server status

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create new vendor
- `GET /api/vendors/:id` - Get specific vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor
- `GET /api/vendors/:id/workers` - Get vendor's workers

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock
- `GET /api/stock/sync` - Sync all vendors' stock
- `GET /api/stock/sync/:vendorId` - Sync specific vendor's stock
- `GET /api/stock/:vendorId` - Get vendor's stock

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/order` - Place new order
  ```json
  {
    "product_id": "PROD001",
    "quantity": 2
  }
  ```
- `GET /api/order/:id` - Get order status

### Workers
- `GET /api/workers` - Get all workers
- `POST /api/workers` - Create new worker
- `GET /api/workers/:id` - Get specific worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

## Understanding IDs in the System

### Vendor IDs
- Format: `vendor_a`, `vendor_b`, etc.
- These are business identifiers you create when adding a vendor
- Example: `vendor_xyz` for XYZ Corporation
- Pre-configured vendors: `vendor_a`, `vendor_b`, `vendor_c`

### Product IDs
- Format: `PROD001`, `PROD002`, etc.
- These are SKU-like identifiers you create when adding a product
- Example: `PROD123` for a specific product
- Pre-configured products: `PROD001` through `PROD005`

### Worker IDs
- Format: `WORK001`, `WORK002`, etc.
- These are employee/worker identifiers you create
- Example: `WORK123` for a specific worker
- Pre-configured workers: `WORK001` through `WORK004`

### Order IDs
- Format: Timestamp-based (automatically generated)
- Example: `1637012345678`
- You don't need to create these - the system generates them

## Sample Data

The system includes sample data across 3 vendors:
- **Vendor A**: Tech Solutions Inc
  - Products: Laptop (PROD001), Monitor (PROD004)
  - Workers: John Doe (WORK001), Alice Brown (WORK004)
- **Vendor B**: Digital Hardware Co
  - Products: Mouse (PROD002), Headphones (PROD005)
  - Workers: Jane Smith (WORK002)
- **Vendor C**: Electronics Plus
  - Products: Keyboard (PROD003)
  - Workers: Bob Johnson (WORK003)

## Testing Order Flow

1. **Check available products**:
```bash
curl http://localhost:3000/api/products
```

2. **Place an order**:
```bash
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{"product_id": "PROD001", "quantity": 1}'
```

3. **Check order status**:
```bash
curl http://localhost:3000/api/order/[ORDER_ID]
```

## Docker Support

For Docker deployment, see [DOCKER.md](DOCKER.md)