create table if not exists pings (
    id          varchar(255) NOT NULL CONSTRAINT ping_pk PRIMARY KEY,
    message     varchar(255) NOT NULL,
    created_at  timestamp default now()
);
