DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'transcendence') THEN 
    CREATE USER transcendence WITH PASSWORD 'garen'; 
  END IF; 
END $$;
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'database') THEN 
    CREATE DATABASE database; 
  END IF; 
END $$;
GRANT ALL PRIVILEGES ON DATABASE database TO transcendence;


