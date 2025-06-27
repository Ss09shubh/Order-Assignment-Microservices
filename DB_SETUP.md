# Database Setup Guide with Sequelize

## 1. Install PostgreSQL (if not already installed)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

## 2. Start PostgreSQL Service

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 3. Create Database

```bash
# Login as postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE order_platform;

# Create user (or use existing postgres user)
CREATE USER postgres WITH PASSWORD 'password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE order_platform TO postgres;

# Exit psql
\q
```

## 4. Update .env File

Make sure your `.env` file has the correct database connection details:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_platform
DB_USER=postgres
DB_PASSWORD=password
```

## 5. Run Setup Script

This will create all tables and insert sample data using Sequelize:

```bash
npm run setup
```

## 6. Verify Database Setup

```bash
# Connect to database
psql -U postgres -d order_platform

# List tables
\dt

# View sample data
SELECT * FROM vendors;
SELECT * FROM products;
SELECT * FROM workers;

# Exit psql
\q
```

## Sequelize Features

The application now uses Sequelize ORM with the following benefits:

1. **Automatic Table Creation**: Tables are created automatically based on model definitions
2. **Data Validation**: Built-in validation for fields
3. **Relationships**: Associations between models are defined
4. **Transactions**: Database transactions for atomic operations
5. **Query Building**: No raw SQL needed

## Database Structure

The database is organized with the following tables:

1. **vendors**: Stores vendor information
   - vendor_id (unique identifier)
   - name
   - api_url
   - status

2. **products**: Stores product information
   - product_id (unique identifier)
   - name
   - vendor_id (references vendors)
   - stock_quantity
   - price

3. **orders**: Stores order information
   - order_id (unique identifier)
   - product_id (references products)
   - quantity
   - status
   - total_price

4. **workers**: Stores worker information
   - worker_id (unique identifier)
   - name
   - vendor_id (references vendors)
   - status

## Troubleshooting

If you encounter connection issues:

1. Check PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Verify connection settings in `.env` file

3. Check PostgreSQL configuration allows local connections:
   ```bash
   sudo nano /etc/postgresql/[version]/main/pg_hba.conf
   ```
   
   Ensure it has:
   ```
   local   all             postgres                                peer
   host    all             all             127.0.0.1/32            md5
   ```