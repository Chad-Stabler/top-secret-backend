-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists users;
drop table if exists secrets;

create table users (
    id bigint generated always as identity primary key,
    email varchar not null,
    password_hash varchar not null
);

create table secrets (
    id bigint generated always as identity primary key,
    title varchar not null,
    description varchar not null,
    created_at timestamp
)
