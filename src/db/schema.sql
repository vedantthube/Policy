CREATE DATABASE benefit_illustration;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE,
    mobile VARCHAR(20),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_name VARCHAR(100),
    policy_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE illustrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    age INTEGER NOT NULL,
    sum_assured NUMERIC NOT NULL,
    premium NUMERIC NOT NULL,
    policy_term INTEGER NOT NULL,
    premium_payment_term INTEGER NOT NULL,
    irr NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);