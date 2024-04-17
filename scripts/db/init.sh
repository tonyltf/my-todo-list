#!/bin/bash

set -e

psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -a << EOF
    -- setup user
    CREATE USER my_user WITH ENCRYPTED PASSWORD 'my_password';
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO my_user;
    GRANT USAGE ON SCHEMA public TO my_user;

    -- setup db
    \connect $POSTGRES_DB
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- init schema
    CREATE TABLE IF NOT EXISTS "user" (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS duty (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL DEFAULT false,
        user_id UUID REFERENCES "user"(id),
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
EOF
