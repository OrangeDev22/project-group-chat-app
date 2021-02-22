CREATE DATABASE groupchat;

CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (email),
    UNIQUE ( user_id ),
    UNIQUE ( user_name)
);

CREATE TABLE user_relationship(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_first_id BIGSERIAl NOT NULL,
    user_second_id BIGSERIAl NOT NULL,
    timestamp BIGSERIAl NOT NULL,
    type VARCHAR(255) NOT NULL
);