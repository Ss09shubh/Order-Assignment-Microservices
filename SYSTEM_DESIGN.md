# System Design Document

## Overview
Order processing platform with stock aggregation from multiple vendors, ensuring consistency and high availability under load.

## Architecture Components

### 1. Stock Sync Flow
```
[Vendor APIs] → [Stock Sync Service] → [PostgreSQL] → [Local Cache]
```
- **Vendor Integration**: Mock REST APIs simulate third-party systems
- **Sync Service**: Periodic polling updates local inventory
- **Local Storage**: PostgreSQL maintains aggregated stock for fast access
- **Consistency**: Upsert operations handle stock updates atomically

### 2. Order Placement Architecture
```
[Client] → [Order API] → [Database Transaction] → [RabbitMQ] → [Worker] → [Vendor Update]
```
- **Order API**: REST endpoint validates and processes orders
- **Atomic Operations**: Single transaction reserves stock and creates order
- **Queue System**: RabbitMQ ensures reliable order processing
- **Async Processing**: Workers handle vendor updates independently

### 3. Queue-based Worker Model
```
[RabbitMQ Queue] → [Order Worker] → [Vendor API] → [Status Update]
```
- **Message Durability**: Persistent queues survive system restarts
- **Single Processing**: Prefetch=1 prevents duplicate processing
- **Retry Logic**: Failed messages requeue with exponential backoff
- **Status Tracking**: Order lifecycle managed through database updates

### 4. Consistency Guarantees

#### Local Consistency (Strong)
- PostgreSQL ACID transactions
- Row-level locking prevents race conditions
- Atomic stock reservation with order creation
- Rollback on any failure

#### Vendor Consistency (Eventual)
- Async vendor updates via message queue
- Retry mechanism for failed vendor calls
- Compensation logic for vendor failures
- Manual reconciliation for critical mismatches

## Data Models

### Products Table
```sql
- product_id (PK, VARCHAR)
- name (VARCHAR)
- vendor_id (VARCHAR)
- stock_quantity (INTEGER)
- price (DECIMAL)
- timestamps
```

### Orders Table
```sql
- order_id (PK, VARCHAR)
- product_id (FK, VARCHAR)
- quantity (INTEGER)
- status (ENUM: pending, completed, failed)
- total_price (DECIMAL)
- timestamps
```

## Scalability Considerations

### Database Layer
- Connection pooling for concurrent requests
- Read replicas for product queries
- Partitioning by vendor_id for large datasets
- Indexing on product_id and order_id

### Application Layer
- Stateless API servers for horizontal scaling
- Load balancer distribution
- Circuit breaker for vendor API calls
- Caching layer for frequently accessed products

### Message Queue
- Multiple worker instances for parallel processing
- Queue partitioning by vendor for isolation
- Dead letter queues for failed messages
- Monitoring and alerting for queue depth

## Failure Scenarios & Recovery

### Vendor API Failures
- Circuit breaker prevents cascade failures
- Retry with exponential backoff
- Fallback to cached stock data
- Manual intervention alerts

### Database Failures
- Connection pool handles temporary outages
- Transaction rollback prevents partial updates
- Read replica failover for queries
- Backup and recovery procedures

### Queue System Failures
- Message persistence survives restarts
- Dead letter queue captures failed messages
- Worker health checks and auto-restart
- Manual message replay capabilities

## Performance Metrics

### Target SLAs
- Order placement: < 200ms (95th percentile)
- Stock sync: < 5 minutes per vendor
- Queue processing: < 1 second per message
- System availability: 99.9%

### Monitoring Points
- API response times
- Database connection pool usage
- Queue depth and processing rate
- Vendor API success rates
- Stock consistency checks