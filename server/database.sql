CREATE DATABASE groupchat;

CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id BIGSERIAL NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (email),
    UNIQUE ( user_id ),
    UNIQUE ( user_name)
);