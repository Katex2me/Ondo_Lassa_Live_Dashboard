# Database Migrations

## Overview

This guide covers database schema management and migrations for the Lassa Dashboard.

## Migration Tools

We use Node.js with raw SQL migrations.

## Creating a Migration

### 1. Create Migration File

```bash
# Create migrations directory
mkdir -p backend/src/migrations

# Create new migration file with timestamp
touch backend/src/migrations/001_initial_schema.sql
```

### 2. Migration File Format

```sql
-- backend/src/migrations/001_initial_schema.sql

-- Create lassa_cases table
CREATE TABLE IF NOT EXISTS lassa_cases (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  region VARCHAR(255) NOT NULL,
  confirmed_cases INT DEFAULT 0,
  suspected_cases INT DEFAULT 0,
  deaths INT DEFAULT 0,
  recovered INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  region VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lassa_cases_date ON lassa_cases(date);
CREATE INDEX IF NOT EXISTS idx_lassa_cases_region ON lassa_cases(region);
CREATE INDEX IF NOT EXISTS idx_alerts_region ON alerts(region);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

## Running Migrations

### Initial Setup

```bash
cd backend

# Initialize database schema
npm run build
node dist/db/init.js

# Seed initial data
npm run seed
```

### Migration Runner

Create `backend/src/db/migrate.ts`:

```typescript
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    // Execute each migration
    for (const file of files) {
      const result = await pool.query(
        'SELECT * FROM migrations WHERE name = $1',
        [file]
      );

      if (result.rows.length === 0) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(
          path.join(migrationsDir, file),
          'utf-8'
        );
        await pool.query(sql);
        await pool.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        console.log(`✓ Migration complete: ${file}`);
      }
    }

    console.log('✓ All migrations complete');
  } catch (error) {
    console.error('✗ Migration error:', error);
    process.exit(1);
  } finally {
    pool.end();
  }
}

runMigrations();
```

Add to `package.json`:

```json
{
  "scripts": {
    "migrate": "tsx src/db/migrate.ts",
    "migrate:create": "node scripts/create-migration.js"
  }
}
```

## Database Schema

### lassa_cases Table

```sql
Column              Type        Description
id                  SERIAL      Primary key
date                DATE        Case date (unique)
region              VARCHAR     Region name
confirmed_cases     INT         Confirmed cases count
suspected_cases     INT         Suspected cases count
deaths              INT         Deaths count
recovered           INT         Recovered cases count
created_at          TIMESTAMP   Record creation time
updated_at          TIMESTAMP   Last update time
```

### alerts Table

```sql
Column              Type        Description
id                  SERIAL      Primary key
title               VARCHAR     Alert title
message             TEXT        Alert message
severity            VARCHAR     Alert level (low/medium/high/critical)
region              VARCHAR     Affected region
created_at          TIMESTAMP   Alert creation time
is_read             BOOLEAN     Read status
```

### users Table

```sql
Column              Type        Description
id                  SERIAL      Primary key
email               VARCHAR     User email (unique)
password_hash       VARCHAR     Hashed password
full_name           VARCHAR     User's full name
role                VARCHAR     User role (admin/analyst/viewer)
is_active           BOOLEAN     Account status
created_at          TIMESTAMP   Account creation time
updated_at          TIMESTAMP   Last update time
```

## Backup & Restore

### Backup Database

```bash
# Using pg_dump
pg_dump postgresql://user:password@localhost:5432/lassa_dashboard > backup.sql

# Using Docker
docker-compose exec postgres pg_dump -U lassa_admin lassa_dashboard > backup.sql
```

### Restore Database

```bash
# Using psql
psql postgresql://user:password@localhost:5432/lassa_dashboard < backup.sql

# Using Docker
docker-compose exec -T postgres psql -U lassa_admin lassa_dashboard < backup.sql
```

## Query Examples

### Add New Case Data

```sql
INSERT INTO lassa_cases (date, region, confirmed_cases, suspected_cases, deaths, recovered)
VALUES ('2024-01-15', 'Ondo State', 45, 12, 5, 30)
ON CONFLICT (date) DO UPDATE SET
  confirmed_cases = EXCLUDED.confirmed_cases,
  suspected_cases = EXCLUDED.suspected_cases,
  deaths = EXCLUDED.deaths,
  recovered = EXCLUDED.recovered,
  updated_at = CURRENT_TIMESTAMP;
```

### Get Latest Statistics

```sql
SELECT
  SUM(confirmed_cases) as total_cases,
  SUM(deaths) as total_deaths,
  SUM(recovered) as total_recovered,
  COUNT(*) as days_tracked
FROM lassa_cases
WHERE date >= NOW()::date - INTERVAL '30 days';
```

### Get Regional Data

```sql
SELECT
  region,
  SUM(confirmed_cases) as total_cases,
  SUM(deaths) as total_deaths,
  SUM(recovered) as total_recovered
FROM lassa_cases
GROUP BY region
ORDER BY total_cases DESC;
```

## Production Considerations

1. **Regular Backups**: Schedule daily backups
2. **Connection Pooling**: Use Railway's managed PostgreSQL
3. **Monitoring**: Track database size and query performance
4. **Indexes**: Create indexes on frequently queried columns
5. **Constraints**: Enforce data integrity with constraints
6. **Transactions**: Use transactions for multi-step operations

## Rollback Strategy

### Manual Rollback

If a migration fails:

```sql
-- Drop the problematic table
DROP TABLE table_name CASCADE;

-- Remove migration record
DELETE FROM migrations WHERE name = 'migration_file.sql';

-- Fix the migration file and re-run
```

### Automated Rollback

Create rollback SQL files:

```bash
backend/src/migrations/
├── 001_initial_schema.sql
├── 001_initial_schema.rollback.sql
├── 002_add_new_column.sql
└── 002_add_new_column.rollback.sql
```
