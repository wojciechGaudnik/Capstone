const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite');


db.serialize(function () {
    db.run(`DROP TABLE IF EXISTS Artist;`);
    db.run(`create table Artist
            (
                id                    integer not null primary key,
                name                  text    not null,
                date_of_birth         text    not null,
                biography             text    not null,
                is_currently_employed integer not null default 1
            );
    `);
    db.run(`drop table if exists Series;`);
    db.run(`create table Series
            (
                id          integer not null primary key,
                name        text    not null,
                description text    not null
            );
    `);
    db.run(`drop table if exists Issue;`);
    db.run(`create table Issue
            (
                id               integer not null primary key,
                name             text    not null,
                issue_number     integer not null,
                publication_date text    not null,
                artist_id        integer not null references Artist(id),
                series_id        integer not null references Series(id)
            );
    `);
})
