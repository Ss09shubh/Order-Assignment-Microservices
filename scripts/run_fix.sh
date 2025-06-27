#!/bin/bash

# Load environment variables
source .env

# Run the SQL script
echo "Running database fix script..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/fix_database.sql