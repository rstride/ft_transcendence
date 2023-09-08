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

-- Create a 'users' table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    ladder_level INT DEFAULT 0,
    achievements JSONB,
    avatar_url VARCHAR(255)
);

-- Create a 'friend_list' table
CREATE TABLE IF NOT EXISTS friend_list (
    user_id INT REFERENCES users(id),
    friend_id INT REFERENCES users(id),
    PRIMARY KEY (user_id, friend_id)
);

-- Create a 'match_history' table
CREATE TABLE IF NOT EXISTS match_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    opponent_id INT REFERENCES users(id),
    result VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a 'chat_channels' table
CREATE TABLE IF NOT EXISTS chat_channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    password VARCHAR(255)
);

-- Create a 'channel_members' table
CREATE TABLE IF NOT EXISTS channel_members (
    channel_id INT REFERENCES chat_channels(id),
    user_id INT REFERENCES users(id),
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (channel_id, user_id)
);

-- Insert some sample data (Optional)
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', 'hashed_password_here'),
('jane_doe', 'jane@example.com', 'another_hashed_password');
